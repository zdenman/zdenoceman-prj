<?php /* Template Name:  About Us */ ?>
<?php get_header() ?>
<section class="hero-grid">
        <div class="max-width2">
            <div class="about-content">
                <h1>Zdeno Čeman <span>//</span> Front-end web developer <span>//</span> UX designer</h1>
                <?php the_content() ?>

                    <h2>Skills</h2>
                    <div class="icons-row">
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/html.png" alt="HTML" title="Html">Html</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/css3.png" alt="Css3" title="Css">Css</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/js.png" alt="javaScript" title="javaScript">javaScript</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/jquery.png" alt="jQuery" title="jQuery">jQuery</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/git.png" alt="Git" title="Git">Git</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/figma.png" alt="Figma" title="Figma">Figma</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/xd.png" alt="Adobe Xd" title="Adobe Xd">Adobe Xd</div>
                       
                        
                    </div>
                    <h2>In progress</h2>
                    <div class="icons-row2">
                        
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/react.png" alt="React" title="React">React</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/node.png" alt="Node.js" title="Node.js">Node.js</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/mongo.png" alt="MongoDB" title="MongoDB">MongoDB</div>
                        <div class="icon-skill"><img src="<?php echo get_template_directory_uri() ?>/images/icons/python.png" alt="Python" title="Python">Python</div>
                        
                    </div>
            </div>
           
        </div>

    </section>
    <?php get_footer() ?>