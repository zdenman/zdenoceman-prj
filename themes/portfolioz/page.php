<?php get_header() ?>
    <section class="hero-grid">
        <div class="max-width">
            <div class="about-content">
                <?php while(have_posts()): the_post() ?> 
                <h2><?php the_title() ?></h2>
                <?php the_content() ?>
                <?php endwhile; ?>
            </div>
        </div>
    </section>
<?php get_footer() ?>