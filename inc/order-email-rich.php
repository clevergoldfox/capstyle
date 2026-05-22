<?php
/**
 * Rich HTML order emails + optional preview image attachment.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @param array<string, mixed> $params Raw POST-style params.
 * @return string|false Absolute path to a temp .jpg file for wp_mail attachment, or false.
 */
function neworder_save_order_preview_from_request(array $params)
{
    if (empty($params['order_preview_png'])) {
        return false;
    }

    $raw = wp_unslash((string) $params['order_preview_png']);
    $raw = preg_replace('/\s+/', '', $raw);
    if ($raw === '' || strlen($raw) > 6 * 1024 * 1024) {
        return false;
    }

    $bin = base64_decode($raw, true);
    if ($bin === false || strlen($bin) < 100) {
        return false;
    }

    $is_png  = strncmp($bin, "\x89PNG", 4) === 0;
    $is_jpeg = strncmp($bin, "\xff\xd8\xff", 3) === 0;
    if (! $is_png && ! $is_jpeg) {
        return false;
    }

    $jpg_path = trailingslashit(get_temp_dir()) . 'neworder-design-' . wp_unique_id() . '.jpg';

    if ($is_jpeg) {
        if (@file_put_contents($jpg_path, $bin) === false) {
            return false;
        }

        return $jpg_path;
    }

    if (! function_exists('imagecreatefromstring') || ! function_exists('imagejpeg')) {
        return false;
    }

    $image = @imagecreatefromstring($bin);
    if ($image === false) {
        return false;
    }

    $saved = imagejpeg($image, $jpg_path, 85);
    imagedestroy($image);

    if (! $saved || ! is_readable($jpg_path)) {
        return false;
    }

    return $jpg_path;
}

/**
 * @param array<string, string> $f Order snapshot (same keys as admin body).
 */
function neworder_order_font_label_for_email($font_id)
{
    $map = array(
        'font_heisei_gothic' => '平成ゴシック（Noto Sans Japanese）',
        'font_heisei_maru'   => '平成丸ゴシック（Kosugi Maru）',
        'font_heisei_mincho' => '平成明朝（Noto Serif Japanese）',
    );
    $id = (string) $font_id;

    return $map[$id] ?? $id;
}

/**
 * @param array<string, string> $f
 */
function neworder_build_order_details_rows_html(array $f)
{
    $design_url = isset($f['text-013']) ? trim((string) $f['text-013']) : '';
    $design_cell = $design_url !== ''
        ? '<a href="' . esc_url($design_url) . '">' . esc_html($design_url) . '</a>'
        : '';

    $rows = array(
        array('刺繍文字', (string) ($f['text-001'] ?? ''), false),
        array('キャップボディ', (string) ($f['text-002'] ?? ''), false),
        array('単価', (string) ($f['text-003'] ?? ''), false),
        array('デザインURL', $design_cell, true),
        array('フォント', neworder_order_font_label_for_email($f['text-005'] ?? ''), false),
        array('氏名', (string) ($f['your-name'] ?? ''), false),
        array('メール', (string) ($f['your-email'] ?? ''), false),
        array('住所', (string) ($f['address'] ?? ''), false),
        array('電話', (string) ($f['telephone'] ?? ''), false),
        array('注文数', (string) ($f['text-012'] ?? ''), false),
        array('支払い方法', (string) ($f['menu-001'] ?? ''), false),
        array('メールマガジン', (string) ($f['_mailmag_label'] ?? ''), false),
        array('備考', (string) ($f['your-message'] ?? ''), 'remarks'),
    );

    $out = '<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;max-width:720px;width:100%;font-family:sans-serif;font-size:14px;">';
    foreach ($rows as $row) {
        if ($row[2] === true) {
            $cell = $row[1];
        } elseif ($row[2] === 'remarks') {
            $cell = nl2br(esc_html($row[1]));
        } else {
            $cell = esc_html($row[1]);
        }
        $out .= '<tr><th style="text-align:left;vertical-align:top;background:#f3f4f6;width:55%;">' . esc_html($row[0]) . '</th><td style="vertical-align:top;width:45%;">' . $cell . '</td></tr>';
    }
    $out .= '</table>';

    return $out;
}

/**
 * @param array<string, string> $f
 */
function neworder_build_design_block_html(array $f)
{
    $url = isset($f['text-013']) ? esc_url($f['text-013']) : '';
    if ($url === '') {
        return '';
    }

    $img = '<p style="margin:16px 0 8px;"><strong>デザイン（ブラウザで表示）</strong></p>'
        . '<p style="margin:0 0 12px;"><a href="' . $url . '">' . esc_html($url) . '</a></p>'
        . '<p style="color:#555;font-size:13px;">※メールクライアントによっては画像が自動表示されない場合があります。上のURLを開くとシミュレーター上のデザインを確認できます。</p>';

    return $img;
}

/**
 * @param array<string, string> $f
 */
function neworder_build_admin_email_html(array $f, $has_preview_attachment)
{
    $logo = esc_url(get_template_directory_uri() . '/assets/images/logo.png');
    $h    = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:sans-serif;line-height:1.6;color:#111;">';
    $h   .= '<p><img src="' . $logo . '" alt="NEW ORDER" style="max-height:48px;"></p>';
    $h   .= '<h1 style="font-size:18px;">【NEW ORDER】新規ご注文</h1>';
    $h   .= neworder_build_order_details_rows_html($f);
    $h   .= neworder_build_design_block_html($f);
    if ($has_preview_attachment) {
        $h .= '<p style="margin-top:16px;"><strong>添付</strong>：キャッププレビュー画像（シミュレーター画面のキャプチャ）</p>';
    }
    $h .= '</body></html>';

    return $h;
}

/**
 * @param array<string, string> $f
 */
function neworder_build_customer_email_html(array $f, $name, $has_preview_attachment)
{
    $logo = esc_url(get_template_directory_uri() . '/assets/images/logo.png');
    $h    = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:sans-serif;line-height:1.6;color:#111;">';
    $h   .= '<p><img src="' . $logo . '" alt="NEW ORDER" style="max-height:48px;"></p>';
    if ($name !== '') {
        $h .= '<p>' . esc_html($name) . ' 様</p>';
    }
    $h .= '<p>管理者側で注文を受け付けました。<br>しばらくお待ちください。</p>';
    $h .= '<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">';
    $h .= '<h2 style="font-size:16px;">ご注文内容</h2>';
    $h .= neworder_build_order_details_rows_html($f);
    $h .= neworder_build_design_block_html($f);
    if ($has_preview_attachment) {
        $h .= '<p style="margin-top:16px;"><strong>添付</strong>：キャッププレビュー画像</p>';
    }
    $h .= '<p style="margin-top:24px;color:#888;font-size:12px;">NEW ORDER</p>';
    $h .= '</body></html>';

    return $h;
}
