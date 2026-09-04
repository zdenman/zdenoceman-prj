<?php
$args = array(
    'post_type' => 'project', // Replace with your custom post type slug
    'posts_per_page' => 3, // Get three posts
    'tax_query' => array(
        array(
            'taxonomy' => 'projects', // or your custom taxonomy name, if different
            'field'    => 'slug',
            'terms'    => 'ux', // Replace with your category slug
        ),
    ),
    'orderby' => 'date',
    'order' => 'DESC' // Get the latest posts
);