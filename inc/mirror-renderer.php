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

    $mirror_file = capstylus_clone_get_mirror_file_by_request($request_path);
    if ($mirror_file === '') {
        return;
    }

    if (capstylus_clone_stream_mirror_file($mirror_file)) {
        exit;
    }
}
add_action('template_redirect', 'capstylus_clone_serve_mirror_pages', 0);
