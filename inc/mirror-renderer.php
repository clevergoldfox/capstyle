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

function capstylus_clone_rewrite_mirror_html($html)
{
    $mirror_uri = capstylus_clone_get_mirror_uri();
    $home_root  = trailingslashit(home_url('/'));
    $logo_uri   = get_template_directory_uri() . '/assets/images/logo.png';
    $favicon_uri = get_template_directory_uri() . '/assets/images/favicon.png';
    $legacy_mirror_uri = trailingslashit(home_url('/')) . 'wp-content/themes/capstyle/mirror';

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
    $html = preg_replace('/<img([^>]+)src="[^"]*logo[^"]*"([^>]*)>/i', '<img$1src="' . esc_url($logo_uri) . '"$2>', $html);

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

    // Make logo visible in dark mirrored headers.
    $html = str_replace(
        '</head>',
        '<style>img[src*="/assets/images/logo.png"]{filter:invert(1) brightness(2)}.site-branding img[src*="/assets/images/logo.png"]{max-height:46px;width:auto}</style></head>',
        $html
    );

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
    if (trim((string) $request_path, '/') === 'simulator') {
        return;
    }

    if (! is_string($request_path)) {
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
