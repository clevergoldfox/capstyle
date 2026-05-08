<?php
/**
 * Theme footer.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}
?>
<footer class="footer">
  <div class="container">
    <p><?php esc_html_e('Local restore theme for CapStylus mirror.', 'capstylus-clone'); ?></p>
    <p>&copy; <?php echo esc_html(date_i18n('Y')); ?> <?php bloginfo('name'); ?>.</p>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
