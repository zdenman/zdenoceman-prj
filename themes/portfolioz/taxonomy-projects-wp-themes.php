<?php get_header() ?>
<!-- Wordpress -->
<section class="hero-grid2 single-custom-category">
    <div class="project-grid max-width2">
        <h2 class="project-category-title">Wordpress</h2>
        <?php 
            include get_template_directory() . '/front/args/wp-args-full.php';
                $query = new WP_Query( $args );
                    if ( $query->have_posts() ) : 
                        while ( $query->have_posts() ) : $query->the_post();
        ?>               
            <div class="project-1">
                <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'project-thumbnails' ); ?></a>
                <h3><?php the_title() ?></h3>
                    <p><?php the_field('project_desc') ?></p>
                    <p><?php the_field('project_type') ?></p>
            </div>
        <?php
            endwhile;
                wp_reset_postdata();
                else : echo 'No projects found';
                endif;
        ?>
    </div>
</section>
<?php get_footer() ?>