<?php get_header() ?>
<div class="container">
    <div class="project-intro" style="background-image:url(<?php echo get_the_post_thumbnail_url() ?>);">>
        <h1 class="project-headline"><?php the_title() ?></h1>
        <p class="project-tagline"><?php the_field('project_desc') ?></p>
        <p class="project-tagline"><?php the_field('project_type') ?></p>
        <div class="scroll-info">Sroll to continue <span><i class="fas fa-arrows-alt-v"></i></span></div>
    </div>
</div> 
<div class="project-content max-width">
<?php the_content() ?> 
</div>    
      
<?php get_footer() ?>