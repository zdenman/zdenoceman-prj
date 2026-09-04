<?php
// Vriables

// Includes
include(get_theme_file_path('/front/enqueue.php'));
include(get_theme_file_path('/front/menu.php'));
include(get_theme_file_path('/front/images.php'));
include(get_theme_file_path('/front/head.php'));



// Hooks
add_action('wp_enqueue_scripts', 'p_enqueue');
add_action( 'init', 'portfolioz_menus' );
add_action( 'after_setup_theme', 'portfolioz_setup' );
add_action( 'after_setup_theme', 'portfolioz_title_tag' );
// add_action( 'wp_head', 'p_head', 4);

// remove logged in header bar
// add_filter( 'show_admin_bar', '__return_false' );
