<?php
$args = array(
    'post_type' => 'project', // Replace with your custom post type slug
    'posts_per_page' => 12, // Get x posts
    'paged' => $paged,
    'tax_query' => array(
        array(
            'taxonomy' => 'projects', // or your custom taxonomy name, if different
            'field'    => 'slug',
            'terms'    => 'wp-themes', // Replace with your category slug
        ),
    ),
    'orderby' => 'date',
    'order' => 'DESC' // Get the latest posts
);