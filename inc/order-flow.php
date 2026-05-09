<?php
/**
 * NEW ORDER: mirror form → email (admin notification + customer auto-reply).
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

const NEWORDER_ORDER_NONCE_ACTION = 'neworder_submit';

/**
 * Send via wp_mail and capture wp_mail_failed for debugging.
 *
 * @param string|array<string> $to      Recipient(s).
 * @param string               $subject Subject.
 * @param string               $body    Body.
 * @param string|string[]      $headers Headers for wp_mail.
 * @return array{sent: bool, error_message: string}
 */
function neworder_wp_mail_attempt($to, $subject, $body, $headers)
{
    $error_message = '';
    $failure_cb    = static function (\WP_Error $wp_error) use (&$error_message) {
        $error_message = $wp_error->get_error_message();
    };

    add_action('wp_mail_failed', $failure_cb, 10, 1);

    try {
        $sent = wp_mail($to, $subject, $body, $headers);
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
    $attempt = neworder_wp_mail_attempt($to, $subject, $body, $headers);
    if ($attempt['sent']) {
        return $attempt;
    }

    usleep(300000); // 0.3s

    $second = neworder_wp_mail_attempt($to, $subject, $body, $headers);

    return array(
        'sent'          => $second['sent'],
        'error_message' => $second['error_message'] !== '' ? $second['error_message'] : $attempt['error_message'],
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
        '環境: ' . ($f['text-011'] ?? ''),
        'キャップID: ' . ($f['text-004'] ?? ''),
        'フォント: ' . ($f['text-005'] ?? ''),
        '刺繍カラー: ' . ($f['text-006'] ?? ''),
        'フォントサイズ: ' . ($f['text-007'] ?? ''),
        'カーニング: ' . ($f['text-008'] ?? ''),
        '縦位置: ' . ($f['text-009'] ?? ''),
        '横位置: ' . ($f['text-010'] ?? ''),
    );

    return implode("\n", $lines);
}

function neworder_build_customer_confirmation_body($name)
{
    $salutation = ($name !== '') ? ($name . " 様\n\n") : '';
    return $salutation
        . "ご注文を受け付けました。\n"
        . "現在検討中なので、しばらくお待ちください。\n\n"
        . "---\n"
        . 'NEW ORDER';
}

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
        'text-013'       => esc_url_raw(wp_unslash((string) ($params['text-013'] ?? ''))),
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

    $admin_email = neworder_get_notification_email();
    if (! is_email($admin_email)) {
        return new WP_REST_Response(array('success' => false, 'message' => __('通知先メールの設定エラーです。', 'capstylus-clone')), 500);
    }

    $admin_subject = __('【NEW ORDER】新規ご注文', 'capstylus-clone');
    $admin_body    = neworder_build_admin_message_body($f);
    $admin_headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $your_name . ' <' . $your_email . '>',
    );

    $customer_subject = __('【NEW ORDER】注文を受け付けました', 'capstylus-clone');
    $customer_body    = neworder_build_customer_confirmation_body($your_name);
    $customer_headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $admin_email,
    );

    $admin_subject    = apply_filters('neworder_admin_email_subject', $admin_subject, $f);
    $customer_subject = apply_filters('neworder_customer_email_subject', $customer_subject, $f);
    $admin_body       = apply_filters('neworder_admin_email_body', $admin_body, $f);
    $customer_body    = apply_filters('neworder_customer_email_body', $customer_body, $f);

    $admin_result = neworder_wp_mail_attempt($admin_email, $admin_subject, $admin_body, $admin_headers);

    if (! $admin_result['sent']) {
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log('NEW ORDER: admin wp_mail failed: ' . $admin_result['error_message']);
        }

        return new WP_REST_Response(
            array('success' => false, 'message' => __('管理者へのメール送信に失敗しました。時間をおいて再度お試しください。', 'capstylus-clone')),
            500
        );
    }

    $customer_result = neworder_wp_mail_attempt_with_retry(
        $your_email,
        $customer_subject,
        $customer_body,
        $customer_headers
    );
    $customer_sent = $customer_result['sent'];

    if (! $customer_sent) {
        do_action('neworder_customer_email_failed', $f, $customer_result['error_message']);
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log(
                'NEW ORDER: customer wp_mail failed (to ' . $your_email . '): ' . $customer_result['error_message']
            );
        }
    }

    $message = $customer_sent
        ? __('注文を送信しました。入力されたメールアドレスに確認メールをお送りします。', 'capstylus-clone')
        : __(
            '注文を受け付けました（管理者へ通知済みです）。自動返信メールが届かない場合は迷惑メールフォルダをご確認ください。メールプロバイダの「サンドボックス」や送信制限で外部アドレス宛の2通目が拒否されることもあります。',
            'capstylus-clone'
        );

    return new WP_REST_Response(
        array(
            'success'          => true,
            'customerMailSent' => (bool) $customer_sent,
            'message'          => $message,
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
            'ajaxUrl'  => esc_url_raw(admin_url('admin-ajax.php')),
            'endpoint' => esc_url_raw(rest_url('neworder/v1/order')),
            'nonce'    => wp_create_nonce(NEWORDER_ORDER_NONCE_ACTION),
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

    $snippet = '<script>window.NEW_ORDER_ORDER_SUBMIT=' . $config . ';</script>'
        . '<script src="' . $src . '" defer></script>';

    return str_replace('</body>', $snippet . "\n</body>", $html);
}
