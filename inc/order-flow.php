<?php
/**
 * NEW ORDER: mirrored order modal → admin-ajax → wp_mail (admin + customer).
 * Does not use Contact Form 7; deactivate that plugin if it is not needed elsewhere.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

const NEWORDER_ORDER_NONCE_ACTION = 'neworder_submit';

/**
 * Whether JSON responses may include a `mailProcessLog` array for the browser console (see order-submit-mirror.js).
 *
 * @return bool
 */
function neworder_should_include_mail_process_log()
{
    return (bool) apply_filters(
        'neworder_include_mail_process_log_in_response',
        defined('WP_DEBUG') && WP_DEBUG
    );
}

/**
 * @param array<int, array<string, mixed>> $log
 */
function neworder_mail_process_log_step(array &$log, float $t0, string $event, array $details = array())
{
    $row = array_merge(
        array(
            'event'     => (string) $event,
            'elapsedMs' => (int) round((microtime(true) - $t0) * 1000),
        ),
        $details
    );
    $log[] = $row;
}

/**
 * @param array<int, array<string, mixed>> $mail_log
 * @return array<string, mixed>
 */
function neworder_order_payload_with_mail_log(array $payload, array $mail_log)
{
    if (neworder_should_include_mail_process_log() && $mail_log !== array()) {
        $payload['mailProcessLog'] = $mail_log;
    }

    return $payload;
}

/**
 * Send via wp_mail and capture wp_mail_failed for debugging.
 *
 * @param string|array<string> $to      Recipient(s).
 * @param string               $subject Subject.
 * @param string               $body    Body.
 * @param string|string[]      $headers     Headers for wp_mail.
 * @param array<int, string>   $attachments Absolute file paths for wp_mail attachments.
 * @return array{sent: bool, error_message: string}
 */
function neworder_wp_mail_attempt($to, $subject, $body, $headers, array $attachments = array())
{
    $error_message = '';
    $failure_cb    = static function (\WP_Error $wp_error) use (&$error_message) {
        $error_message = $wp_error->get_error_message();
    };

    add_action('wp_mail_failed', $failure_cb, 10, 1);

    try {
        $sent = wp_mail($to, $subject, $body, $headers, $attachments);
    } catch (\Throwable $e) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
        $sent          = false;
        $error_message = $e->getMessage();
    }

    remove_action('wp_mail_failed', $failure_cb, 10);

    return array(
        'sent'          => (bool) $sent,
        'error_message' => $error_message,
    );
}

/**
 * Try twice with a short pause (some SMTP / PHPMailer combinations fail on back-to-back sends).
 *
 * @param string|array<string> $to Recipient(s).
 * @param string               $subject Subject.
 * @param string               $body Body.
 * @param string|string[]      $headers Headers for wp_mail.
 * @return array{sent: bool, error_message: string}
 */
function neworder_wp_mail_attempt_with_retry($to, $subject, $body, $headers)
{
    return neworder_wp_mail_attempt_with_retries($to, $subject, $body, $headers, 2, array(300000), false, array());
}

/**
 * Reset WordPress PHPMailer singleton before the next wp_mail() — avoids broken back-to-back sends with some SMTP plugins.
 *
 * Enabled by default between admin notification and customer confirmation only (see dispatch).
 *
 * @return void
 */
function neworder_wp_mail_force_new_phpmailer_instance()
{
    unset($GLOBALS['phpmailer']); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedGlobalFound
}

/**
 * Retry wp_mail with configurable pauses and PHPMailer resets (each attempt uses a fresh singleton when reset is on).
 *
 * @param int   $max_attempts    Number of tries (min 1).
 * @param array $delay_useconds  Pauses after failures: index 0 = after 1st failure, etc.
 * @param bool  $reset_before_each When true, clears $phpmailer global before every attempt.
 * @param array<int, string> $attachments Absolute file paths for wp_mail attachments.
 * @return array{sent: bool, error_message: string}
 */
function neworder_wp_mail_attempt_with_retries($to, $subject, $body, $headers, $max_attempts, array $delay_useconds, $reset_before_each = false, array $attachments = array())
{
    $max_attempts = max(1, (int) $max_attempts);

    $last_error = '';
    for ($i = 0; $i < $max_attempts; $i++) {
        if ($reset_before_each) {
            neworder_wp_mail_force_new_phpmailer_instance();
        }
        if ($i > 0) {
            $pause = isset($delay_useconds[$i - 1]) ? (int) $delay_useconds[$i - 1] : 500000;
            if ($pause > 0) {
                usleep($pause);
            }
        }

        $attempt = neworder_wp_mail_attempt($to, $subject, $body, $headers, $attachments);
        if ($attempt['sent']) {
            return $attempt;
        }

        $last_error = $attempt['error_message'] !== '' ? $attempt['error_message'] : $last_error;
    }

    return array(
        'sent'          => false,
        'error_message' => $last_error,
    );
}

function neworder_register_order_rest_route()
{
    register_rest_route(
        'neworder/v1',
        '/order',
        array(
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'callback'            => 'neworder_rest_handle_order_post',
        )
    );
}
add_action('rest_api_init', 'neworder_register_order_rest_route');

/**
 * Many hosts / WAFs block POST to /wp-json/*. Front-end submits here first.
 */
function neworder_ajax_handle_order_submit()
{
    $params = wp_unslash($_POST);
    unset($params['action']);
    $response = neworder_dispatch_order_request($params);
    wp_send_json($response->get_data(), $response->get_status());
}
add_action('wp_ajax_nopriv_neworder_submit_order', 'neworder_ajax_handle_order_submit');
add_action('wp_ajax_neworder_submit_order', 'neworder_ajax_handle_order_submit');

function neworder_rest_handle_order_post(WP_REST_Request $request)
{
    $params = $request->get_json_params();
    if (! is_array($params)) {
        return new WP_REST_Response(array('success' => false, 'message' => __('リクエスト形式が無効です。', 'capstylus-clone')), 400);
    }

    return neworder_dispatch_order_request($params);
}

function neworder_get_notification_email()
{
    return apply_filters('neworder_notification_email', 'info@neworder-cap.com');
}

/**
 * Legacy mirror URLs may still use capstylus.com; admin mail should show this site (e.g. neworder-cap.com).
 *
 * @param string $url Raw design URL (may include query string).
 * @return string
 */
function neworder_normalize_design_share_url($url)
{
    $url = trim((string) $url);
    if ($url === '') {
        return '';
    }

    $home = wp_parse_url(home_url('/'));
    if (! is_array($home) || empty($home['scheme']) || empty($home['host'])) {
        return $url;
    }

    $replacement = $home['scheme'] . '://' . $home['host'];
    if (! empty($home['port'])) {
        $replacement .= ':' . (int) $home['port'];
    }
    if (! empty($home['path']) && $home['path'] !== '/') {
        $replacement .= untrailingslashit($home['path']);
    }

    $out = preg_replace('#https?://(?:www\.)?capstylus\.com#i', $replacement, $url);

    if (! is_string($out) || $out === '') {
        return $url;
    }

    // デザイン共有: シミュレーターのみ表示（注文フォームの自動ポップアップを抑止）。
    if (preg_match('/[?&]body=/i', $out) && ! preg_match('/[?&]preview=1(?:&|$)/i', $out)) {
        $out .= (strpos($out, '?') !== false) ? '&preview=1' : '?preview=1';
    }

    return $out;
}

/**
 * @param string|false $path Absolute path from neworder_save_order_preview_from_request().
 */
function neworder_maybe_unlink_order_preview_temp($path)
{
    if (! is_string($path) || $path === '') {
        return;
    }
    if (is_readable($path)) {
        // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
        @unlink($path);
    }
}

function neworder_build_admin_message_body(array $f)
{
    $lines = array(
        '【NEW ORDER】新規ご注文',
        '',
        '--- お客様情報 ---',
        '氏名: ' . ($f['your-name'] ?? ''),
        'メール: ' . ($f['your-email'] ?? ''),
        '住所: ' . ($f['address'] ?? ''),
        '電話: ' . ($f['telephone'] ?? ''),
        '注文数: ' . ($f['text-012'] ?? ''),
        '支払い方法: ' . ($f['menu-001'] ?? ''),
        'メールマガジン: ' . ($f['_mailmag_label'] ?? ''),
        '備考: ' . ($f['your-message'] ?? ''),
        '',
        '--- カスタム内容 ---',
        '刺繍文字: ' . ($f['text-001'] ?? ''),
        'キャップボディ: ' . ($f['text-002'] ?? ''),
        '単価: ' . ($f['text-003'] ?? ''),
        'デザインURL: ' . ($f['text-013'] ?? ''),
        'フォント: ' . neworder_order_font_label_for_email($f['text-005'] ?? ''),
    );

    return implode("\n", $lines);
}

function neworder_build_customer_confirmation_body($name)
{
    $salutation = ($name !== '') ? ($name . " 様\n\n") : '';
    return $salutation
        . "管理者側で注文を受け付けました。\n"
        . "しばらくお待ちください。\n\n"
        . "---\n"
        . 'NEW ORDER';
}

/**
 * Headers for the customer auto-reply.
 *
 * From should match the mailbox your SMTP provider signs (SPF/DKIM). Admin order mail uses
 * `neworder_get_notification_email()` — default the customer From to that same address so filters
 * do not see a mismatch (common spam cause when From was `get_option('admin_email')` e.g. Gmail).
 *
 * @param string $admin_reply_to Admin inbox for Reply-To (same as notification email in typical setup).
 * @param bool   $is_html        When true, use HTML Content-Type (matches rich customer confirmation body).
 * @return array<int, string>
 */
function neworder_build_customer_confirmation_mail_headers($admin_reply_to, $is_html = false)
{
    $admin_reply_to = sanitize_email((string) $admin_reply_to);

    $headers = array(
        $is_html
            ? 'Content-Type: text/html; charset=UTF-8'
            : 'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $admin_reply_to,
    );

    $default_from = neworder_get_notification_email();
    if (! is_email($default_from)) {
        $default_from = (string) get_option('admin_email');
    }

    $from = apply_filters('neworder_customer_confirmation_mail_from_email', $default_from);
    $from = sanitize_email((string) $from);
    if (is_email($from)) {
        $headers[] = 'From: NEW ORDER <' . $from . '>';
    }

    return $headers;
}

/**
 * Last-resort: send confirmation in a separate request (cron) when same-request delivery fails (common with some SMTP relays).
 *
 * @param string $your_email Recipient.
 * @param string $subject    Subject line.
 * @param string $body       Plain-text body (already finalized / filtered upstream).
 * @param string $reply_to   Reply-To mailbox (typically admin inbox).
 */
function neworder_schedule_fallback_customer_confirmation_mail($your_email, $subject, $body, $reply_to)
{
    if (! apply_filters('neworder_schedule_fallback_customer_confirmation_mail', true)) {
        return;
    }

    $your_email = sanitize_email((string) $your_email);
    $reply_to   = sanitize_email((string) $reply_to);

    if (! is_email($your_email) || ! is_email($reply_to)) {
        return;
    }

    $delay = max(5, min(600, (int) apply_filters('neworder_customer_mail_fallback_delay_seconds', 20)));

    wp_schedule_single_event(
        time() + $delay,
        'neworder_fallback_customer_confirmation_mail',
        array(
            $your_email,
            (string) $subject,
            (string) $body,
            $reply_to,
        )
    );

    if (apply_filters('neworder_fallback_customer_confirmation_spawn_cron', true) && function_exists('spawn_cron')) {
        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.prevent_path_disclosure_spawn_cron_ok
        spawn_cron();
    }
}

/**
 * Send customer confirmation after the HTTP response is finished (admin-ajax JSON already sent).
 * Avoids relying on WP-Cron (often disabled or never triggered on low-traffic sites).
 *
 * @param string               $to              Customer email.
 * @param string               $subject         Subject.
 * @param string               $body            Body.
 * @param string[]|string      $headers         Same shape as wp_mail $headers.
 * @param string               $admin_for_cron  Admin mailbox for Reply-To when scheduling cron backup.
 * @param array<int, string>   $attachments     Paths passed to wp_mail (same preview file as admin mail when present).
 * @param string               $preview_cleanup_path If non-empty, unlink after shutdown send attempt (temp preview file).
 */
function neworder_register_customer_confirmation_on_shutdown($to, $subject, $body, $headers, $admin_for_cron, array $attachments = array(), $preview_cleanup_path = '')
{
    if (! apply_filters('neworder_send_customer_confirmation_on_shutdown', true)) {
        return;
    }

    $to              = sanitize_email((string) $to);
    $admin_for_cron = sanitize_email((string) $admin_for_cron);
    $subject         = (string) $subject;
    $body            = (string) $body;
    $preview_cleanup_path = (string) $preview_cleanup_path;
    if (! is_array($headers)) {
        $headers = array($headers);
    }

    if (! is_email($to) || ! is_email($admin_for_cron)) {
        return;
    }

    add_action(
        'shutdown',
        static function () use ($to, $subject, $body, $headers, $admin_for_cron, $attachments, $preview_cleanup_path) {
            $pause = (int) apply_filters('neworder_shutdown_customer_mail_pause_microseconds', 400000);
            if ($pause > 0) {
                usleep(min(max(0, $pause), 2000000));
            }

            neworder_wp_mail_force_new_phpmailer_instance();

            $attempts = max(1, min(5, (int) apply_filters('neworder_shutdown_customer_mail_max_attempts', 4)));
            $delays   = apply_filters(
                'neworder_shutdown_customer_mail_retry_delays_useconds',
                array(500000, 1000000, 1500000)
            );
            if (! is_array($delays)) {
                $delays = array(500000, 1000000, 1500000);
            }

            $result = neworder_wp_mail_attempt_with_retries(
                $to,
                wp_strip_all_tags($subject),
                $body,
                $headers,
                $attempts,
                $delays,
                true,
                $attachments
            );

            if ($preview_cleanup_path !== '' && is_readable($preview_cleanup_path)) {
                // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
                @unlink($preview_cleanup_path);
            }

            if (! $result['sent'] && defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
                error_log(
                    'NEW ORDER: shutdown customer wp_mail failed (to ' . $to . '): ' . $result['error_message']
                );
            }

            if (! $result['sent'] && apply_filters('neworder_schedule_cron_if_shutdown_customer_mail_fails', true)) {
                neworder_schedule_fallback_customer_confirmation_mail($to, $subject, $body, $admin_for_cron);
            }
        },
        999
    );
}

/**
 * Cron callback — must match args scheduled in neworder_schedule_fallback_customer_confirmation_mail().
 *
 * @param string $your_email Recipient.
 * @param string $subject    Subject line.
 * @param string $body       Plain-text body.
 * @param string $reply_to   Reply-To header value (email only).
 */
function neworder_run_fallback_customer_confirmation_mail($your_email, $subject, $body, $reply_to)
{
    if (! is_email($your_email) || ! is_email($reply_to)) {
        return;
    }

    $is_html_body = (stripos((string) $body, '<body') !== false || stripos((string) $body, '<table') !== false);

    $headers = apply_filters(
        'neworder_customer_confirmation_mail_headers',
        neworder_build_customer_confirmation_mail_headers($reply_to, $is_html_body),
        $your_email,
        $reply_to,
        null
    );

    neworder_wp_mail_force_new_phpmailer_instance();

    $attempts    = max(1, min(5, (int) apply_filters('neworder_fallback_customer_confirmation_mail_max_attempts', 5)));
    $delay_usec  = apply_filters(
        'neworder_fallback_customer_confirmation_mail_retry_delays_useconds',
        array(400000, 800000, 1200000)
    );

    $result = neworder_wp_mail_attempt_with_retries(
        $your_email,
        wp_strip_all_tags((string) $subject),
        (string) $body,
        $headers,
        $attempts,
        is_array($delay_usec) ? $delay_usec : array(600000, 1200000),
        true,
        array()
    );

    if (! $result['sent']) {
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log(
                'NEW ORDER: fallback cron customer wp_mail failed (to ' . $your_email . '): ' . $result['error_message']
            );
        }
    }
}
add_action(
    'neworder_fallback_customer_confirmation_mail',
    'neworder_run_fallback_customer_confirmation_mail',
    10,
    4
);

/**
 * Shared order processor (REST JSON or admin-ajax $_POST).
 *
 * @param array $params Mixed keys mirroring front form (+ _wpnonce).
 * @return WP_REST_Response Payload always JSON shape { success, message?, customerMailSent? } (status as HTTP code).
 */
function neworder_dispatch_order_request(array $params)
{
    $nonce = isset($params['_wpnonce']) ? sanitize_text_field(wp_unslash((string) $params['_wpnonce'])) : '';
    if (! wp_verify_nonce($nonce, NEWORDER_ORDER_NONCE_ACTION)) {
        return new WP_REST_Response(
            array(
                'success' => false,
                'message' => __('送信の有効期限が切れたか、検証に失敗しました。ページを再読み込みしてください。', 'capstylus-clone'),
            ),
            403
        );
    }

    if (empty($params['acceptance-001'])) {
        return new WP_REST_Response(
            array('success' => false, 'message' => __('「注意事項を確認しました」にチェックを入れてください。', 'capstylus-clone')),
            400
        );
    }

    $your_name          = sanitize_text_field(wp_unslash((string) ($params['your-name'] ?? '')));
    $your_email         = sanitize_email(wp_unslash((string) ($params['your-email'] ?? '')));
    $your_email_confirm = sanitize_email(wp_unslash((string) ($params['your-email_confirm'] ?? '')));
    $address            = sanitize_text_field(wp_unslash((string) ($params['address'] ?? '')));
    $telephone          = sanitize_text_field(wp_unslash((string) ($params['telephone'] ?? '')));
    $order_qty          = sanitize_text_field(wp_unslash((string) ($params['text-012'] ?? '')));
    $payment            = sanitize_text_field(wp_unslash((string) ($params['menu-001'] ?? '')));
    $remarks            = sanitize_textarea_field(wp_unslash((string) ($params['your-message'] ?? '')));

    if ($your_name === '' || $your_email === '' || $address === '' || $telephone === '' || $order_qty === '') {
        return new WP_REST_Response(array('success' => false, 'message' => __('必須項目を入力してください。', 'capstylus-clone')), 400);
    }

    if (! is_email($your_email)) {
        return new WP_REST_Response(array('success' => false, 'message' => __('メールアドレスの形式が正しくありません。', 'capstylus-clone')), 400);
    }

    if ($your_email !== $your_email_confirm) {
        return new WP_REST_Response(array('success' => false, 'message' => __('メールアドレス（確認用）が一致しません。', 'capstylus-clone')), 400);
    }

    $allowed_pay = array('代金引換', '銀行振り込み');
    if ($payment !== '' && ! in_array($payment, $allowed_pay, true)) {
        return new WP_REST_Response(array('success' => false, 'message' => __('支払い方法が無効です。', 'capstylus-clone')), 400);
    }

    $mailmag_parts = isset($params['checkbox-001']) ? (array) $params['checkbox-001'] : array();
    $mailmag_parts = array_map(
        static function ($v) {
            return sanitize_text_field(wp_unslash((string) $v));
        },
        $mailmag_parts
    );
    $mailmag_label = $mailmag_parts !== array() ? implode(', ', $mailmag_parts) : '希望しない';

    $f = array(
        'your-name'      => $your_name,
        'your-email'     => $your_email,
        'address'        => $address,
        'telephone'      => $telephone,
        'text-012'       => $order_qty,
        'menu-001'       => $payment,
        '_mailmag_label' => $mailmag_label,
        'your-message'   => $remarks,
        'text-001'       => sanitize_text_field(wp_unslash((string) ($params['text-001'] ?? ''))),
        'text-002'       => sanitize_text_field(wp_unslash((string) ($params['text-002'] ?? ''))),
        'text-003'       => sanitize_text_field(wp_unslash((string) ($params['text-003'] ?? ''))),
        'text-013'       => apply_filters(
            'neworder_design_url_for_email',
            neworder_normalize_design_share_url(
                esc_url_raw(wp_unslash((string) ($params['text-013'] ?? '')))
            ),
            $params
        ),
        'text-011'       => sanitize_text_field(wp_unslash((string) ($params['text-011'] ?? ''))),
        'text-004'       => sanitize_text_field(wp_unslash((string) ($params['text-004'] ?? ''))),
        'text-005'       => sanitize_text_field(wp_unslash((string) ($params['text-005'] ?? ''))),
        'text-006'       => sanitize_text_field(wp_unslash((string) ($params['text-006'] ?? ''))),
        'text-007'       => sanitize_text_field(wp_unslash((string) ($params['text-007'] ?? ''))),
        'text-008'       => sanitize_text_field(wp_unslash((string) ($params['text-008'] ?? ''))),
        'text-009'       => sanitize_text_field(wp_unslash((string) ($params['text-009'] ?? ''))),
        'text-010'       => sanitize_text_field(wp_unslash((string) ($params['text-010'] ?? ''))),
    );

    do_action('neworder_before_send_order_emails', $f);

    $use_rich_html = (bool) apply_filters('neworder_order_emails_use_html', true);
    $preview_path  = false;
    if ($use_rich_html) {
        $preview_path = neworder_save_order_preview_from_request($params);
    }
    $mail_attachments = array();
    if (is_string($preview_path) && $preview_path !== '' && is_readable($preview_path)) {
        $mail_attachments = array($preview_path);
    }
    $has_preview_attachment = $mail_attachments !== array();
    $preview_cleanup        = (is_string($preview_path) && $preview_path !== '') ? $preview_path : '';

    $admin_email = neworder_get_notification_email();
    if (! is_email($admin_email)) {
        neworder_maybe_unlink_order_preview_temp($preview_cleanup);

        return new WP_REST_Response(array('success' => false, 'message' => __('通知先メールの設定エラーです。', 'capstylus-clone')), 500);
    }

    $admin_subject = __('【NEW ORDER】新規ご注文', 'capstylus-clone');
    $customer_subject = __('【NEW ORDER】注文を受け付けました', 'capstylus-clone');

    if ($use_rich_html) {
        $admin_body    = neworder_build_admin_email_html($f, $has_preview_attachment);
        $customer_body = neworder_build_customer_email_html($f, $your_name, $has_preview_attachment);
        $admin_headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'Reply-To: ' . $your_name . ' <' . $your_email . '>',
        );
    } else {
        $admin_body    = neworder_build_admin_message_body($f);
        $customer_body = neworder_build_customer_confirmation_body($your_name);
        $admin_headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $your_name . ' <' . $your_email . '>',
        );
    }

    $admin_subject    = apply_filters('neworder_admin_email_subject', $admin_subject, $f);
    $customer_subject = apply_filters('neworder_customer_email_subject', $customer_subject, $f);
    $admin_body       = apply_filters('neworder_admin_email_body', $admin_body, $f);
    $customer_body    = apply_filters('neworder_customer_email_body', $customer_body, $f);

    $customer_headers = apply_filters(
        'neworder_customer_confirmation_mail_headers',
        neworder_build_customer_confirmation_mail_headers($admin_email, $use_rich_html),
        $your_email,
        $admin_email,
        $f
    );

    $mail_t0  = microtime(true);
    $mail_log = array();

    /*
     * Many SMTP relays drop the second wp_mail if fired back-to-back in the same "phase" as the admin mail.
     * Default: admin mail in this request; customer mail on `shutdown` after JSON is sent (no dependency on WP-Cron).
     * Set filter `neworder_defer_customer_confirmation_to_wp_cron` false for legacy inline two-mail mode.
     */
    $defer_customer = apply_filters('neworder_defer_customer_confirmation_to_wp_cron', true);

    neworder_mail_process_log_step(
        $mail_log,
        $mail_t0,
        'config',
        array(
            'deferCustomerToCron' => (bool) $defer_customer,
        )
    );

    $customer_sent  = false;
    $customer_queued = false;
    $customer_err    = '';

    if ($defer_customer) {
        neworder_mail_process_log_step($mail_log, $mail_t0, 'admin_wp_mail_start', array('role' => 'admin_notification'));

        neworder_wp_mail_force_new_phpmailer_instance();

        $admin_result = neworder_wp_mail_attempt($admin_email, $admin_subject, $admin_body, $admin_headers, $mail_attachments);

        neworder_mail_process_log_step(
            $mail_log,
            $mail_t0,
            'admin_wp_mail_done',
            array(
                'sent'  => (bool) $admin_result['sent'],
                'error' => $admin_result['error_message'] !== ''
                    ? substr($admin_result['error_message'], 0, 200)
                    : '',
            )
        );

        if (! $admin_result['sent']) {
            neworder_maybe_unlink_order_preview_temp($preview_cleanup);
            if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
                error_log('NEW ORDER: admin wp_mail failed: ' . $admin_result['error_message']);
            }

            return new WP_REST_Response(
                neworder_order_payload_with_mail_log(
                    array(
                        'success'              => false,
                        'customerMailSent'     => false,
                        'customerMailQueued'   => false,
                        'message'              => __('管理者へのメール送信に失敗しました。時間をおいて再度お試しください。', 'capstylus-clone'),
                    ),
                    $mail_log
                ),
                500
            );
        }

        neworder_register_customer_confirmation_on_shutdown(
            $your_email,
            $customer_subject,
            $customer_body,
            $customer_headers,
            $admin_email,
            $mail_attachments,
            $preview_cleanup
        );

        $customer_queued = true;

        $pause_usec = (int) apply_filters('neworder_shutdown_customer_mail_pause_microseconds', 400000);
        $pause_usec = min(max(0, $pause_usec), 2000000);

        neworder_mail_process_log_step(
            $mail_log,
            $mail_t0,
            'customer_confirmation_registered_shutdown',
            array(
                'pauseMsBeforeSend' => (int) round($pause_usec / 1000),
            )
        );

        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log(
                'NEW ORDER: customer confirmation registered on shutdown (to ' . $your_email . ') after successful admin wp_mail.'
            );
        }

        return new WP_REST_Response(
            neworder_order_payload_with_mail_log(
                array(
                    'success'              => true,
                    'customerMailSent'     => false,
                    'customerMailQueued'   => true,
                    'message'              => __(
                        '注文を受け付けました。ご登録のメールアドレス宛に確認メールを送信しています（数秒以内）。届かない場合は迷惑メールフォルダをご確認ください。',
                        'capstylus-clone'
                    ),
                ),
                $mail_log
            ),
            200
        );
    }

    /* ---------- Legacy same-request behaviour (SMTP must accept two mails in one request) ---------- */

    neworder_mail_process_log_step($mail_log, $mail_t0, 'legacy_same_request_pipeline', array());

    $customer_first = apply_filters('neworder_send_customer_confirmation_before_admin', false);

    neworder_mail_process_log_step(
        $mail_log,
        $mail_t0,
        'legacy_order',
        array('customerMailBeforeAdmin' => (bool) $customer_first)
    );

    $customer_attempts = max(1, min(5, (int) apply_filters('neworder_customer_confirmation_mail_max_attempts', 3)));
    $retry_delays_usec = apply_filters(
        'neworder_customer_confirmation_mail_retry_delays_useconds',
        array(600000, 1200000)
    );
    if (! is_array($retry_delays_usec)) {
        $retry_delays_usec = array(600000, 1200000);
    }

    $pause_between = (int) apply_filters(
        'neworder_pause_microseconds_between_admin_and_customer_mail',
        500000
    );
    $pause_between = min(max(0, $pause_between), 2000000);

    if ($customer_first) {
        neworder_mail_process_log_step($mail_log, $mail_t0, 'customer_wp_mail_start', array('role' => 'customer_confirmation'));

        neworder_wp_mail_force_new_phpmailer_instance();

        $customer_result = neworder_wp_mail_attempt_with_retries(
            $your_email,
            $customer_subject,
            $customer_body,
            $customer_headers,
            $customer_attempts,
            $retry_delays_usec,
            true,
            $mail_attachments
        );

        $customer_sent = $customer_result['sent'];
        $customer_err  = $customer_result['error_message'];

        neworder_mail_process_log_step(
            $mail_log,
            $mail_t0,
            'customer_wp_mail_done',
            array(
                'sent'  => (bool) $customer_sent,
                'error' => $customer_err !== '' ? substr($customer_err, 0, 200) : '',
            )
        );

        if (apply_filters('neworder_reset_phpmailer_before_admin_mail', true)) {
            neworder_wp_mail_force_new_phpmailer_instance();
        }

        if ($pause_between > 0) {
            usleep($pause_between);
        }
    }

    neworder_mail_process_log_step($mail_log, $mail_t0, 'admin_wp_mail_start', array('role' => 'admin_notification'));

    $admin_result = neworder_wp_mail_attempt($admin_email, $admin_subject, $admin_body, $admin_headers, $mail_attachments);

    neworder_mail_process_log_step(
        $mail_log,
        $mail_t0,
        'admin_wp_mail_done',
        array(
            'sent'  => (bool) $admin_result['sent'],
            'error' => $admin_result['error_message'] !== ''
                ? substr($admin_result['error_message'], 0, 200)
                : '',
        )
    );

    if (! $admin_result['sent']) {
        neworder_maybe_unlink_order_preview_temp($preview_cleanup);
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log('NEW ORDER: admin wp_mail failed: ' . $admin_result['error_message']);
        }

        return new WP_REST_Response(
            neworder_order_payload_with_mail_log(
                array(
                    'success'              => false,
                    'customerMailSent'     => (bool) $customer_sent,
                    'customerMailQueued'   => false,
                    'message'              => __('管理者へのメール送信に失敗しました。時間をおいて再度お試しください。', 'capstylus-clone'),
                ),
                $mail_log
            ),
            500
        );
    }

    if (! $customer_first) {
        if (apply_filters('neworder_reset_phpmailer_before_customer_mail', true)) {
            neworder_wp_mail_force_new_phpmailer_instance();
        }

        if ($pause_between > 0) {
            usleep($pause_between);
        }

        neworder_mail_process_log_step($mail_log, $mail_t0, 'customer_wp_mail_start', array('role' => 'customer_confirmation'));

        $customer_result = neworder_wp_mail_attempt_with_retries(
            $your_email,
            $customer_subject,
            $customer_body,
            $customer_headers,
            $customer_attempts,
            $retry_delays_usec,
            true,
            $mail_attachments
        );

        $customer_sent = $customer_result['sent'];
        $customer_err  = $customer_result['error_message'];

        neworder_mail_process_log_step(
            $mail_log,
            $mail_t0,
            'customer_wp_mail_done',
            array(
                'sent'  => (bool) $customer_sent,
                'error' => $customer_err !== '' ? substr($customer_err, 0, 200) : '',
            )
        );
    }

    if (! $customer_sent) {
        neworder_schedule_fallback_customer_confirmation_mail(
            $your_email,
            $customer_subject,
            $customer_body,
            $admin_email
        );

        neworder_mail_process_log_step($mail_log, $mail_t0, 'customer_confirmation_queued_wp_cron_fallback', array());

        do_action('neworder_customer_email_failed', $f, $customer_err);
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log(
                'NEW ORDER: customer wp_mail failed (to ' . $your_email . '): ' . $customer_err . ' — scheduled cron retry'
            );
        }
    } else {
        neworder_mail_process_log_step($mail_log, $mail_t0, 'customer_mail_ok_same_request', array());
    }

    $message = $customer_sent
        ? __('注文を送信しました。入力されたメールアドレスに確認メールをお送りします。', 'capstylus-clone')
        : __(
            '注文を受け付けました（管理者へ通知済みです）。確認メールの送信を自動で再試行していますので、数十秒〜数分ほどお待ちいただいても届かない場合は迷惑メールフォルダをご確認ください。',
            'capstylus-clone'
        );

    neworder_maybe_unlink_order_preview_temp($preview_cleanup);

    return new WP_REST_Response(
        neworder_order_payload_with_mail_log(
            array(
                'success'              => true,
                'customerMailSent'     => (bool) $customer_sent,
                'customerMailQueued'   => false,
                'message'              => $message,
            ),
            $mail_log
        ),
        200
    );
}

function neworder_mirror_append_order_submit_script($html)
{
    if (stripos($html, 'formWrap') === false) {
        return $html;
    }

    $config = wp_json_encode(
        array(
            'ajaxUrl'              => esc_url_raw(admin_url('admin-ajax.php')),
            'endpoint'             => esc_url_raw(rest_url('neworder/v1/order')),
            'nonce'                => wp_create_nonce(NEWORDER_ORDER_NONCE_ACTION),
            'mailProcessLogClient' => neworder_should_include_mail_process_log(),
            'thankYouUrl'          => esc_url_raw(home_url('/order-finish/')),
        ),
        JSON_UNESCAPED_SLASHES
    );

    $src = esc_url(
        add_query_arg(
            'ver',
            rawurlencode((string) wp_get_theme()->get('Version')),
            get_template_directory_uri() . '/assets/js/order-submit-mirror.js'
        )
    );

    $snippet = '<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>'
        . '<script>window.NEW_ORDER_ORDER_SUBMIT=' . $config . ';</script>'
        . '<script src="' . $src . '" defer></script>';

    return str_replace('</body>', $snippet . "\n</body>", $html);
}
