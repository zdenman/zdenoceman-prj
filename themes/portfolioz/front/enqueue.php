<?php

function p_enqueue() {
    // Register styles
    wp_register_style('zc_popins', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Ubuntu:wght@400;500;700&display=swap', array(), null);
    wp_register_style('zc_fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css', array(), null);
    wp_register_style('zc_justified_gallery_css', get_template_directory_uri() . '/css/justifiedGallery.min.css', array(), null);
    wp_register_style('zc_colorbox', get_template_directory_uri() . '/css/colorbox.css', array(), null);
    wp_register_style('zc_style', get_theme_file_uri('/css/style.css'));
    
    // Enqueue styles ---------------------------------
    wp_enqueue_style( 'zc_popins' );
    wp_enqueue_style( 'zc_fontawesome' );
    // Enqueue this styles only on page with ID 29 (photography)
    if( is_page( 29 ) ) {
    wp_enqueue_style( 'zc_justified_gallery_css' );
    wp_enqueue_style( 'zc_colorbox' );
    }
    wp_enqueue_style( 'zc_style' );
    
    // Register scripts -----------------------------------------------------------------------------------------------------------
    wp_register_script('zc_typed', 'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js', array('jquery'), '2.0.12', true);
    wp_register_script('zc_typed_local', get_template_directory_uri() . '/js/typed.js', array('jquery'), '2.0.12', true);
    wp_register_script('zc_justified_gallery_js', get_template_directory_uri() . '/js/jquery.justifiedGallery.min.js', array('jquery'), null, true);
    wp_register_script('zc_colorbox_js', get_template_directory_uri() . '/js/jquery.colorbox-min.js', array('jquery'), null, true);
    wp_register_script('zc_animate', get_template_directory_uri() . '/js/animate.js', array('jquery'), null, true);
    wp_register_script('zc_animatep', get_template_directory_uri() . '/js/animatep.js', array('jquery'), null, true);
    wp_register_script('zc_script_gallery', get_template_directory_uri() . '/js/script.gallery.js', array('jquery'), null, true);
    wp_register_script('zc_script', get_template_directory_uri() . '/js/script.js', array(), null, true); //last argument 'true' is for loading script in footer
    
     // Localize the script with theme directory (required for gallery sript with json (theme_vars))
     $theme_array = array('theme_url' => get_template_directory_uri());
     wp_localize_script('zc_script_gallery', 'theme_vars', $theme_array);

    // Enqueue JavaScript files------------------------------------
    wp_enqueue_script('jquery');
   
     // Enqueue this scripts only on page with ID 29 (photography)
    if( is_page( 29 ) ) {
        wp_enqueue_script('zc_justified_gallery_js');
        wp_enqueue_script('zc_colorbox_js');
        wp_enqueue_script('zc_script_gallery');
    }

    wp_enqueue_script('zc_script');   
};

// Enqueuing and dequeuing of some script on certain pages and post types
function custom_enqueue_and_dequeue_scripts() {
    // Array of page slugs where the scripts should be enqueued or dequeued
    $specific_pages = array('about', 'projects', 'photography', 'contact'); // Replace with your page slugs
    
    // Check if the current page is in the specific pages array or is a single post of a custom post type
    if (is_page($specific_pages)) {
        // Enqueue the script you want to include on these pages
        wp_enqueue_script('zc_animatep');
        
        // Dequeue the script you want to exclude on these pages
        wp_dequeue_script('zc_animate'); // Replace with the handle of the script you want to dequeue
    } elseif (is_singular('project')) { // Replace 'your_custom_post_type' with your actual custom post type
        // Dequeue the script on single post pages of the custom post type
        wp_dequeue_script('zc_animate'); // Replace with the handle of the script you want to dequeue
    } elseif (is_front_page() || is_home() || !is_page( 6 )) {
        // Ensure the dequeued script continues to work on the homepage and other pages
        wp_enqueue_script('zc_animate');
        wp_enqueue_script('zc_typed');
        wp_enqueue_script('zc_typed_local');
    }
}
add_action('wp_enqueue_scripts', 'custom_enqueue_and_dequeue_scripts');


// Removing JQuery migrate info from console

function dequeue_jquery_migrate( $scripts ) {
    if ( ! is_admin() && isset( $scripts->registered['jquery'] ) ) {
        $script = $scripts->registered['jquery'];
        
        if ( $script->deps ) {
            $script->deps = array_diff( $script->deps, array( 'jquery-migrate' ) );
        }
    }
}
add_action( 'wp_default_scripts', 'dequeue_jquery_migrate' );




