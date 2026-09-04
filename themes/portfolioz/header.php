<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-K1GHHP9Q54"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-K1GHHP9Q54');
</script>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="<?php echo get_template_directory_uri() ?>/images/icons/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri() ?>/images/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri() ?>/images/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri() ?>/images/icons/favicon-16x16.png">  
    
    
    <!-- <title>Zdeno Čeman portfolio</title> -->
    <meta name="description" content="Portfolio of my work - UX case study & Frontend">
    <meta name="author" content="Zdeno Čeman">

    <!-- Open Graph Protocol -->
    <meta property="og:title" content="Zdeno Čeman portfolio">
    <meta property="og:type" content="Website">
    <meta property="og:image"  content="<?php echo get_template_directory_uri() ?>/images/3devices.webp">
    <meta property="og:url" content="https://www.zdenoceman.com">
    <meta property="og:description" content="Portfolio of my work as UX designer & Front-end web developer">
    <meta property="og:locale" content="en_US">
    <meta property="og:site_name" content="Zdeno Čeman portfolio">
    <?php wp_head() ?>
</head>
<body <?php body_class(); ?>>
<canvas id="canvas"></canvas>
<div class="wrapper">
        <div class="scroll-up-btn">
            <i class="fas fa-angle-up"></i>
        </div>
        <nav class="navbar">
            <div class="max-width">
                <div class="logo"><a href="#home">ZC<span>.</span></a></div>
                <?php 
                $args = array(
                    'theme_location' => 'header-menu',
                    'container' => 'ul',
                    'container_class' => 'menu'
                );
                wp_nav_menu( $args );
            ?>
                    <div class="menu-btn">
                        <i class="fas fa-bars"></i>
                    </div>
            </div>
        </nav>