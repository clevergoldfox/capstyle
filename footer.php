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
    <p><?php esc_html_e('CapStylus | SNAPBACK CAPS CUSTOM ORDER', 'capstylus-clone'); ?></p>
    <div class="footer-links">
      <a href="https://www.capstylus.com/contact"><?php esc_html_e('Contact', 'capstylus-clone'); ?></a>
      <a href="https://www.capstylus.com/privacy-policy"><?php esc_html_e('Privacy Policy', 'capstylus-clone'); ?></a>
      <a href="tel:03-5625-1755">03-5625-1755</a>
    </div>
    <p>&copy; <?php echo esc_html(date_i18n('Y')); ?> CapStylus.</p>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
