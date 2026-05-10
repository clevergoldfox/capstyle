<?php
/**
 * Contact Form 7 points _wpcf7.loaderUrl at plugin images/ajax-loader.gif (path differs across versions).
 * Patching avoids 404 GETs before our CSS hides the image.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

add_action(
    'wp_enqueue_scripts',
    static function (): void {
        if (! wp_script_is('contact-form-7', 'enqueued')) {
            return;
        }

        $data_uri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        wp_add_inline_script(
            'contact-form-7',
            'try{if(typeof window._wpcf7==="object"){window._wpcf7.loaderUrl=' . wp_json_encode($data_uri, JSON_UNESCAPED_SLASHES) . ';}}catch(e){}',
            'after'
        );
    },
    9999
);
