<?php /* Template Name:  Projects */ ?>
<?php get_header() ?>
<!-- UX Design -->
<section class="hero-grid3">
    <div class="project-grid max-width2">
        <h2 class="project-category-title project-ux-title">UX Design</h2>
        <?php 
            include get_template_directory() . '/front/args/ux-args.php';
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
<!-- Wordpress -->
<section class="hero-grid2">
    <div class="project-grid max-width2">
    <div class="project-title-container-3">
    <h2 class="project-category-title">Wordpress</h2><a href="<?php echo get_site_url() ?>/projects/wp-themes/" class="read-more-project">View all</a>
    </div>
        <?php 
            include get_template_directory() . '/front/args/wp-args.php';
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
<!-- JavaScript -->
<section class="hero-grid2">
    <div class="project-grid max-width2">
        <h2 class="project-category-title">JavaScript Playground</h2>
        <?php 
            include get_template_directory() . '/front/args/js-args.php';
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
<!-- Html -->
<section class="hero-grid2">
    <div class="project-grid max-width2">
        <h2 class="project-category-title">Html/Css/Js</h2>
        <?php 
            include get_template_directory() . '/front/args/html-args.php';
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










