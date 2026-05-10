<?php
/**
 * Mirror HTML rendering helpers.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

function capstylus_clone_get_mirror_root()
{
    return get_template_directory() . '/mirror';
}

function capstylus_clone_get_mirror_uri()
{
    return untrailingslashit(get_template_directory_uri()) . '/mirror';
}

/**
 * Remove mirrored CapStylus sections that NEW ORDER does not use (non–New Era SKUs, third-party branding).
 *
 * @param string $html Raw or partially rewritten mirror HTML.
 * @return string
 */
function neworder_mirror_apply_content_filters($html)
{
    // Simulator: non–NE cap radios only. MUST keep capBody closures + fontBody/fontBodyInner
    // (do not delete up to first name="font" — that stripped </div></div><div class="fontBody">).
    $html = preg_replace(
        '#<!-- BRIMSTAR BRS01-001 -->.*?(?=\s*</div>\s*</div>\s*<div class="fontBody">\s*<div class="fontBodyInner">)#s',
        '',
        $html
    );

    // Home: CAPBODY section — non–New Era listings and 「その他」 promo row.
    $html = preg_replace(
        '#\s*<div class="capbodyBox clearfix wow fadeInUp" data-wow-duration="1\.6s">\s*<h2><img[^>]*body_brimstar[^>]*>[\s\S]*?<div class="capbodyBox clearfix wow fadeInUp" data-wow-duration="1\.6s" style="text-align:center;">[\s\S]*?<!-- /capbodyBox -->#',
        '',
        $html
    );

    // Black background multi-brand logo strip.
    $html = preg_replace(
        '#<section class="brands">[\s\S]*?</section>\s*<!--\s*/brands\s*-->#',
        '',
        $html
    );

    // Footer Mask Stylus promo block.
    $html = preg_replace(
        '#<div class="mailMag">\s*<div class="bn-link">[\s\S]*?</div>\s*</div>\s*#',
        '',
        $html
    );

    return $html;
}

function neworder_cf7_placeholder_loader_json_url()
{
    /* No HTTP request — avoids 404 when plugin images path differs from bundled mirror (e.g. images/ vs assets/). */
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
}

function capstylus_clone_rewrite_mirror_html($html)
{
    $mirror_uri = capstylus_clone_get_mirror_uri();
    $home_root  = trailingslashit(home_url('/'));
    $logo_uri   = get_template_directory_uri() . '/assets/images/logo.png';
    $logo_white_uri = get_template_directory_uri() . '/assets/images/logo-white.png';
    $favicon_uri = get_template_directory_uri() . '/assets/images/favicon.png';
    $legacy_mirror_uri = trailingslashit(home_url('/')) . 'wp-content/themes/capstyle/mirror';

    /* Deprecated viewport form — Safari warns and truncates "320px" to a bogus width. */
    $html = preg_replace(
        '/<meta\s+name="viewport"\s+content="width=320px[^"]*"\s*\/?>/i',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        $html
    );

    /*
     * Inline CF7 localization uses JSON-style escapes for slashes: \"loaderUrl\":\"https:\\/\\/...\"
     * Match the literal \/ after the colon (four backslashes in this PHP pattern).
     */
    $tiny_loader_json = '"' . neworder_cf7_placeholder_loader_json_url() . '"';
    $html             = preg_replace(
        '#"loaderUrl":"https:\\\\/\\\\/[^"]+"#',
        '"loaderUrl":' . $tiny_loader_json,
        $html
    );
    $html = preg_replace(
        '#"loaderUrl":"http:\\\\/\\\\/[^"]+"#',
        '"loaderUrl":' . $tiny_loader_json,
        $html
    );

    $html = str_replace('https://www.capstylus.com', $mirror_uri, $html);
    $html = str_replace('http://www.capstylus.com', $mirror_uri, $html);
    $html = str_replace('//www.capstylus.com', $mirror_uri, $html);
    $html = str_replace('src="/wp-content/', 'src="' . $mirror_uri . '/wp-content/', $html);
    $html = str_replace('href="/wp-content/', 'href="' . $mirror_uri . '/wp-content/', $html);
    $html = str_replace('src="/wp-includes/', 'src="' . $mirror_uri . '/wp-includes/', $html);
    $html = str_replace('href="/wp-includes/', 'href="' . $mirror_uri . '/wp-includes/', $html);
    $html = str_replace('href="/', 'href="' . $home_root, $html);
    $html = str_replace('action="/', 'action="' . $home_root, $html);
    $html = str_replace('src="//', 'src="https://', $html);
    $html = str_replace('href="//', 'href="https://', $html);
    $html = str_replace('CapStylus', 'NEW ORDER', $html);
    $html = str_replace('capstylus.com', wp_parse_url(home_url('/'), PHP_URL_HOST), $html);
    $html = str_replace('order@capstylus.com', 'order@neworder.local', $html);
    $html = preg_replace('/<title>.*?<\/title>/is', '<title>NEW ORDER | キャップ刺繍シミュレーター</title>', $html);
    $html = preg_replace('/<meta property="og:site_name" content="[^"]*"\s*\/?>/i', '<meta property="og:site_name" content="NEW ORDER" />', $html);
    $html = preg_replace('/<meta property="og:title" content="[^"]*"\s*\/?>/i', '<meta property="og:title" content="NEW ORDER | キャップ刺繍シミュレーター" />', $html);
    $html = preg_replace('/<meta property="og:image" content="[^"]*"\s*\/?>/i', '<meta property="og:image" content="' . esc_url($logo_uri) . '" />', $html);
    $html = preg_replace('/<link rel="shortcut icon"[^>]*>/i', '<link rel="shortcut icon" href="' . esc_url($favicon_uri) . '" type="image/png">', $html);
    $html = preg_replace('/<link rel="apple-touch-icon-precomposed"[^>]*>/i', '<link rel="apple-touch-icon-precomposed" href="' . esc_url($favicon_uri) . '">', $html);
    // Replace top dark-header logo with white NEW ORDER logo.
    $html = preg_replace('/<h1>\s*<a[^>]*>\s*<img[^>]*src="[^"]*capstylus\.png"[^>]*>\s*<\/a>\s*<\/h1>/i', '<h1><a href="' . esc_url($home_root) . '"><img src="' . esc_url($logo_white_uri) . '" alt="NEW ORDER"></a></h1>', $html);
    // Keep other branded logos (fallback).
    $html = preg_replace('/<img([^>]+)src="[^"]*\/assets\/images\/logo\.png"([^>]*)>/i', '<img$1src="' . esc_url($logo_uri) . '"$2>', $html);

    // Keep asset links on mirror, but route page/form links to home URL.
    $html = preg_replace_callback(
        '/\b(href|action)="([^"]+)"/i',
        static function ($matches) use ($mirror_uri, $legacy_mirror_uri, $home_root) {
            $attribute = $matches[1];
            $url = $matches[2];
            $normalized = $url;
            $mirror_prefixes = array($mirror_uri . '/', rtrim($mirror_uri, '/'), $legacy_mirror_uri . '/', rtrim($legacy_mirror_uri, '/'));

            foreach ($mirror_prefixes as $prefix) {
                if (stripos($url, $prefix) === 0) {
                    $normalized = ltrim(substr($url, strlen($prefix)), '/');
                    break;
                }
            }

            if ($normalized === $url) {
                return $matches[0];
            }

            if (preg_match('#^(wp-content/|wp-includes/|_endpoints/)#i', $normalized)) {
                return $attribute . '="' . esc_url($mirror_uri . '/' . ltrim($normalized, '/')) . '"';
            }

            return $attribute . '="' . esc_url($home_root . ltrim($normalized, '/')) . '"';
        },
        $html
    );

    // Ensure white logo rendering on dark header areas.
    $html = str_replace(
        '</head>',
        '<style>header h1 img[src*="/assets/images/logo-white.png"]{max-height:46px;width:auto;display:block}.site-branding img[src*="/assets/images/logo.png"]{max-height:46px;width:auto}</style></head>',
        $html
    );

    $html = neworder_mirror_apply_content_filters($html);

    if (function_exists('neworder_mirror_append_order_submit_script')) {
        $html = neworder_mirror_append_order_submit_script($html);
    }

    return $html;
}

function capstylus_clone_get_mirror_file_by_request($request_path)
{
    $request_path = trim((string) $request_path, '/');
    $mirror_root  = capstylus_clone_get_mirror_root();

    $candidates = array();
    if ($request_path === '') {
        $candidates[] = $mirror_root . '/index.html';
    } else {
        $candidates[] = $mirror_root . '/' . $request_path . '/index.html';
        $candidates[] = $mirror_root . '/' . $request_path . '.html';
    }

    foreach ($candidates as $candidate) {
        if (file_exists($candidate) && is_readable($candidate)) {
            return $candidate;
        }
    }

    return '';
}

function capstylus_clone_stream_mirror_file($file)
{
    if (! file_exists($file) || ! is_readable($file)) {
        return false;
    }

    $html = file_get_contents($file);
    if ($html === false) {
        return false;
    }

    status_header(200);
    nocache_headers();
    echo capstylus_clone_rewrite_mirror_html($html); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    return true;
}

function capstylus_clone_serve_mirror_pages()
{
    if (is_admin()) {
        return;
    }

    $request_uri  = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '/';
    $request_path = wp_parse_url($request_uri, PHP_URL_PATH);
    if (! is_string($request_path)) {
        return;
    }

    // Support subdirectory installs like /wordpress.
    $home_path = wp_parse_url(home_url('/'), PHP_URL_PATH);
    if (is_string($home_path) && $home_path !== '' && $home_path !== '/') {
        if (strpos($request_path, $home_path) === 0) {
            $request_path = substr($request_path, strlen($home_path));
            if (! is_string($request_path) || $request_path === '') {
                $request_path = '/';
            }
        }
    }

    if (trim((string) $request_path, '/') === 'simulator') {
        return;
    }

    $mirror_file = capstylus_clone_get_mirror_file_by_request($request_path);
    if ($mirror_file === '') {
        return;
    }

    if (capstylus_clone_stream_mirror_file($mirror_file)) {
        exit;
    }
}
add_action('template_redirect', 'capstylus_clone_serve_mirror_pages', 0);
