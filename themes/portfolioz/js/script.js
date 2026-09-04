$ = jQuery.noConflict();
//Navbar Menu Script
$(document).ready(function () {
  $(window).scroll(function () {
    if (this.scrollY > 20) {
      $(".navbar").addClass("sticky")
    } else {
      $(".navbar").removeClass("sticky")
    }
    // Up Button
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show")
    } else {
      $(".scroll-up-btn").removeClass("show")
    }
  })
})
// Toggle Menu / Navbar script
$(".menu-btn").click(function () {
  $(".navbar .menu").toggleClass("active")
  $(".menu-btn i").toggleClass("active")
})
// Slide up script
$(".scroll-up-btn").click(function () {
  $("html").animate({ scrollTop: 0 })
})

document.querySelectorAll('.menu-btn').forEach(link => {
  if(link.href === window.location.href){
    link.setAttribute('aria-current', 'page')
  }
})

