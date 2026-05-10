<?php
/**
 * Replace mirrored order modal markup with the live Contact Form 7 shortcode output.
 *
 * The simulator (`edit.js`) fills fields by CSS class (.characterInput, .nameInput, …).
 * Replicate those class names on the matching inputs in your CF7 form markup.
 *
 * @package capstylus-clone
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Default CF7 shortcode for the overlay order form (override via filter).
 *
 * Note: CF7 “id” is usually the numeric form post ID. Use the correct id from WP Admin ▸ Contact ▸ your form (copy shortcode).
 */
function neworder_cf7_default_order_shortcode_string()
{
    return '[contact-form-7 id="72122df" title="Cap Order Form"]';
}

/**
 * Strip legacy CF7 assets bundled in snapshot HTML — they clash with newer plugin markup / paths.
 *
 * Submission is handled by `order-submit-mirror.js` → `neworder_submit_order` + `wp_verify_nonce(..., NEWORDER_ORDER_NONCE_ACTION)`,
 * so we do not need CF7-front-end AJAX on this overlay.
 *
 * @param string $html Rewritten mirror HTML.
 * @return string
 */
function neworder_mirror_strip_legacy_cf7_script_tags($html)
{
    $html = preg_replace(
        '#<script[^>]+contact-form-7/includes/js/jquery\.form[^\s>]+\s*></script>#i',
        '',
        $html
    );

    $html = preg_replace(
        '#<script[^>]+contact-form-7/includes/js/scripts\.js[^\s>]+\s*></script>#i',
        '',
        $html
    );

    /*
     * Older mirrors ship an inline `_wpcf7` localization block with dead loader URLs — remove so it does not collide.
     */
    $html = preg_replace(
        '#<script\b[^>]*>\s*(?:/\*[^\n]*CDATA[^\n]*\*/\s*)?var\s+_wpcf7\s*=\s*\{[\s\S]*?\};\s*</script>#is',
        '',
        $html
    );

    return $html;
}

/**
 * Replace inner content of `#formWrap` with the rendered CF7 form.
 *
 * @param string $html Rewritten mirror HTML.
 * @return string
 */
function neworder_mirror_replace_formwrap_with_cf7($html)
{
    if (! apply_filters('neworder_use_cf7_order_form_in_mirror', true)) {
        return $html;
    }

    if (! function_exists('do_shortcode') || ! shortcode_exists('contact-form-7')) {
        return $html;
    }

    $shortcode = apply_filters(
        'neworder_cf7_order_form_shortcode',
        neworder_cf7_default_order_shortcode_string()
    );

    $shortcode = trim((string) $shortcode);
    if ($shortcode === '') {
        return $html;
    }

    /*
     * Mirrors: `#formWrap` opens, then `.wpcf7` wrapper, `</form>`, wrapper `</div>`, `#formWrap` `</div>`.
     */
    $pattern = '#(<div\s+id=["\']formWrap["\'][^>]*>)\s*<div[^>]*\bwpcf7\b[^>]*>[\s\S]*?</form>\s*</div>\s*</div>#i';

    $markup = do_shortcode($shortcode);

    $did      = 0;
    $replaced = preg_replace(
        $pattern,
        '$1' . $markup . '</div>',
        $html,
        1,
        $did
    );

    $html = ( $did > 0 ) ? $replaced : $html;

    if ($did > 0) {
        $html = neworder_mirror_strip_legacy_cf7_script_tags($html);
    }

    return $html;
}
