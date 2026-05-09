<?php
/**
 * Theme setup and asset loading.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

function capstylus_clone_setup()
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array('height' => 120, 'width' => 360, 'flex-height' => true, 'flex-width' => true));
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));

    register_nav_menus(
        array(
            'primary' => __('Primary Menu', 'capstylus-clone'),
        )
    );
}
add_action('after_setup_theme', 'capstylus_clone_setup');

function capstylus_clone_enqueue_assets()
{
    wp_enqueue_style(
        'capstylus-clone-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );

    wp_enqueue_style('neworder-fonts', 'https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap', array(), null);
}
add_action('wp_enqueue_scripts', 'capstylus_clone_enqueue_assets');

function capstylus_clone_output_favicon()
{
    $favicon = get_template_directory_uri() . '/assets/images/favicon.png';
    echo '<link rel="icon" type="image/png" href="' . esc_url($favicon) . '" sizes="32x32" />' . "\n";
}
add_action('wp_head', 'capstylus_clone_output_favicon');
