<?php
/**
 * Theme header.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
  <div class="container header-inner">
    <div class="site-branding">
      <a href="<?php echo esc_url(home_url('/')); ?>">CapStylus</a>
    </div>
    <nav class="site-nav" aria-label="<?php esc_attr_e('Primary navigation', 'capstylus-clone'); ?>">
      <a href="#custom-order"><?php esc_html_e('Custom Order', 'capstylus-clone'); ?></a>
      <a href="#capbody"><?php esc_html_e('Cap Body', 'capstylus-clone'); ?></a>
      <a href="#discount"><?php esc_html_e('Volume Discount', 'capstylus-clone'); ?></a>
      <a href="#faq"><?php esc_html_e('FAQ', 'capstylus-clone'); ?></a>
    </nav>
  </div>
</header>
