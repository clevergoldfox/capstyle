<?php
/**
 * NEW ORDER simulator integration.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

function neworder_simulator_catalog()
{
    return array(
        array(
            'id' => 'ne400',
            'name' => 'NE400',
            'colors' => array('BLACK', 'CHARCOAL', 'NAVY', 'ROYAL', 'BLACK-RED', 'BLACK-ORANGE', 'BLACK-BLUE', 'CHARCOAL-NAVY', 'CAMO', 'WHITE'),
        ),
        array(
            'id' => 'ne400-flag',
            'name' => 'NE400 FLAG',
            'colors' => array('BLACK', 'CHARCOAL', 'NAVY', 'GREY', 'ROYAL', 'WHITE', 'CHARCOAL-NAVY', 'BLACK-ORANGE'),
        ),
        array('id' => 'ne403', 'name' => 'NE403', 'colors' => array('BLACK', 'CAMO', 'GREY', 'NAVY', 'OLIVE', 'ROYAL')),
        array('id' => 'ne403-flag', 'name' => 'NE403 FLAG', 'colors' => array('BLACK', 'NAVY')),
        array('id' => 'ne404', 'name' => 'NE404', 'colors' => array('BLACK', 'NAVY', 'RED')),
        array('id' => 'ne304', 'name' => 'NE304', 'colors' => array('BLACK', 'NAVY', 'ROYAL')),
        array('id' => 'ne205', 'name' => 'NE205', 'colors' => array('BLACK', 'NAVY')),
        array('id' => 'ne205-flag', 'name' => 'NE205 FLAG', 'colors' => array('BLACK', 'NAVY')),
        array('id' => 'ne201-flag', 'name' => 'NE201 FLAG', 'colors' => array('BLACK', 'NAVY')),
        array('id' => 'ne001', 'name' => 'NE001', 'colors' => array('BLACK', 'NAVY', 'GRAPHITE', 'WHITE', 'BEIGE')),
        array('id' => 'ne501', 'name' => 'NE501', 'colors' => array('BLACK', 'NAVY', 'GRAPHITE', 'ROYAL', 'SKY BLUE', 'WHITE')),
        array('id' => 'ne215', 'name' => 'NE215', 'colors' => array('BLACK', 'NAVY', 'GRAPHITE', 'ROYAL', 'RED')),
        array('id' => 'ne900', 'name' => 'NE900', 'colors' => array('BLACK', 'NAVY', 'GREY')),
        array('id' => 'ne908', 'name' => 'NE908', 'colors' => array('BLACK', 'NAVY', 'GREY')),
    );
}

function neworder_simulator_fonts()
{
    return array(
        array('id' => 'noto-sans-jp', 'displayName' => '平成ゴシック', 'fontFamily' => '"Noto Sans JP", sans-serif'),
        array('id' => 'kosugi-maru', 'displayName' => '平成丸ゴシック', 'fontFamily' => '"Kosugi Maru", sans-serif'),
        array('id' => 'noto-serif-jp', 'displayName' => '平成明朝', 'fontFamily' => '"Noto Serif JP", serif'),
    );
}

function neworder_simulator_colors()
{
    return array(
        array('id' => 'white', 'hex' => '#ffffff', 'name' => 'White'),
        array('id' => 'black', 'hex' => '#000000', 'name' => 'Black'),
        array('id' => 'red', 'hex' => '#d92e2e', 'name' => 'Red'),
        array('id' => 'orange', 'hex' => '#f08c00', 'name' => 'Orange'),
        array('id' => 'yellow', 'hex' => '#f6c100', 'name' => 'Yellow'),
        array('id' => 'lime', 'hex' => '#9ccf00', 'name' => 'Lime'),
        array('id' => 'green', 'hex' => '#1f8a49', 'name' => 'Green'),
        array('id' => 'mint', 'hex' => '#3fbf9f', 'name' => 'Mint'),
        array('id' => 'cyan', 'hex' => '#25b6d2', 'name' => 'Cyan'),
        array('id' => 'sky', 'hex' => '#3e98e5', 'name' => 'Sky Blue'),
        array('id' => 'blue', 'hex' => '#2350d4', 'name' => 'Blue'),
        array('id' => 'navy', 'hex' => '#1c2f5f', 'name' => 'Navy'),
        array('id' => 'purple', 'hex' => '#6a3fb6', 'name' => 'Purple'),
        array('id' => 'magenta', 'hex' => '#bf3f9d', 'name' => 'Magenta'),
        array('id' => 'pink', 'hex' => '#df7094', 'name' => 'Pink'),
        array('id' => 'brown', 'hex' => '#6b4a2d', 'name' => 'Brown'),
        array('id' => 'beige', 'hex' => '#d2b48c', 'name' => 'Beige'),
        array('id' => 'gold', 'hex' => '#b1892e', 'name' => 'Gold'),
        array('id' => 'silver', 'hex' => '#9aa0a8', 'name' => 'Silver'),
        array('id' => 'charcoal', 'hex' => '#3a3a3a', 'name' => 'Charcoal'),
        array('id' => 'gray', 'hex' => '#7d7d7d', 'name' => 'Gray'),
        array('id' => 'light-gray', 'hex' => '#cccccc', 'name' => 'Light Gray'),
        array('id' => 'maroon', 'hex' => '#6d1f2f', 'name' => 'Maroon'),
        array('id' => 'wine', 'hex' => '#8a1f4d', 'name' => 'Wine'),
        array('id' => 'khaki', 'hex' => '#877b52', 'name' => 'Khaki'),
        array('id' => 'olive', 'hex' => '#5f6d3a', 'name' => 'Olive'),
        array('id' => 'teal', 'hex' => '#1c6d69', 'name' => 'Teal'),
        array('id' => 'royal', 'hex' => '#1f4ed8', 'name' => 'Royal'),
        array('id' => 'scarlet', 'hex' => '#c1272d', 'name' => 'Scarlet'),
        array('id' => 'ivory', 'hex' => '#f8f5e8', 'name' => 'Ivory'),
    );
}

function neworder_simulator_is_active()
{
    if (is_page_template('page-simulator.php')) {
        return true;
    }

    global $post;
    return $post instanceof WP_Post && has_shortcode((string) $post->post_content, 'neworder_simulator');
}

function neworder_simulator_enqueue_assets()
{
    if (! neworder_simulator_is_active()) {
        return;
    }

    wp_enqueue_style('neworder-simulator-style', get_template_directory_uri() . '/assets/css/simulator.css', array(), wp_get_theme()->get('Version'));
    wp_enqueue_script('fabric-js', 'https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js', array(), '5.3.0', true);
    wp_enqueue_script('neworder-simulator-core', get_template_directory_uri() . '/assets/js/simulator/core.js', array('fabric-js'), wp_get_theme()->get('Version'), true);
    wp_enqueue_script('neworder-simulator-fonts', get_template_directory_uri() . '/assets/js/simulator/fonts.js', array('neworder-simulator-core'), wp_get_theme()->get('Version'), true);
    wp_enqueue_script('neworder-simulator-controls', get_template_directory_uri() . '/assets/js/simulator/controls.js', array('neworder-simulator-fonts'), wp_get_theme()->get('Version'), true);
    wp_enqueue_script('neworder-simulator-export', get_template_directory_uri() . '/assets/js/simulator/export.js', array('neworder-simulator-controls'), wp_get_theme()->get('Version'), true);
    wp_enqueue_script('neworder-simulator-mobile', get_template_directory_uri() . '/assets/js/simulator/mobile-ui.js', array('neworder-simulator-export'), wp_get_theme()->get('Version'), true);

    wp_localize_script(
        'neworder-simulator-core',
        'NEW_ORDER_SIMULATOR_DATA',
        array(
            'products' => neworder_simulator_catalog(),
            'fonts' => neworder_simulator_fonts(),
            'threadColors' => neworder_simulator_colors(),
            'defaults' => array(
                'text' => 'NEW ORDER',
                'fontId' => 'noto-sans-jp',
                'colorId' => 'black',
                'fontSize' => 56,
                'letterSpacing' => 0,
                'x' => 0,
                'y' => 0,
            ),
        )
    );
}
add_action('wp_enqueue_scripts', 'neworder_simulator_enqueue_assets');

function neworder_simulator_shortcode()
{
    ob_start();
    get_template_part('template-parts/simulator');
    return (string) ob_get_clean();
}
add_shortcode('neworder_simulator', 'neworder_simulator_shortcode');

function neworder_simulator_serve_virtual_page()
{
    if (is_admin()) {
        return;
    }

    $request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '/';
    $path = wp_parse_url($request_uri, PHP_URL_PATH);
    if (! is_string($path) || trim($path, '/') !== 'simulator') {
        return;
    }

    status_header(200);
    get_header();
    get_template_part('template-parts/simulator');
    get_footer();
    exit;
}
add_action('template_redirect', 'neworder_simulator_serve_virtual_page', 1);
