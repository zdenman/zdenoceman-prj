<?php
// Adding suport for images
function portfolioz_setup(){
    // enabling featured image
    add_theme_support( 'post-thumbnails' );
	add_image_size('project-thumbnails', 364, 240, true);
    // add_image_size('blog-single-sidebar', 665, 380, true);
    // add_image_size('related-posts-sidebar', 335, 200, true);
}
