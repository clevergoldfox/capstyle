<?php
/**
 * Front page template.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

$mirror_file = capstylus_clone_get_mirror_file_by_request('/');
if ($mirror_file && capstylus_clone_stream_mirror_file($mirror_file)) {
    exit;
}

get_header();
?>
<main class="section">
  <div class="container">
    <h1><?php esc_html_e('Mirror not generated yet.', 'capstylus-clone'); ?></h1>
    <p><?php esc_html_e('Run the mirror refresh script from the project root to restore the site snapshot.', 'capstylus-clone'); ?></p>
    <p><a href="<?php echo esc_url(home_url('/simulator/')); ?>"><?php esc_html_e('Open NEW ORDER Simulator', 'capstylus-clone'); ?></a></p>
  </div>
</main>
<?php
get_footer();
