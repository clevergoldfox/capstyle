<?php
/**
 * Main fallback template.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();
?>

<main class="section">
  <div class="container">
    <?php if (have_posts()) : ?>
      <?php while (have_posts()) : the_post(); ?>
        <article <?php post_class(); ?>>
          <h1><?php the_title(); ?></h1>
          <?php the_content(); ?>
        </article>
      <?php endwhile; ?>
    <?php else : ?>
      <h1><?php esc_html_e('No content found', 'capstylus-clone'); ?></h1>
    <?php endif; ?>
  </div>
</main>

<?php
get_footer();
