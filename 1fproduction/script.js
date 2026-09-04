$(document).ready(function () {
  // Funkcia na detekciu mobilných zariadení pomocou user agentu
  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Aplikovanie správania na základe detekcie mobilného zariadenia alebo veľkosti okna
  function applyBannerBehavior() {
    const banner1 = document.getElementById("banner1");
    const banner2 = document.getElementById("banner2");
    const banner3 = document.getElementById("banner3");
    const banner4 = document.getElementById("banner4");

    if (isMobileDevice()) {
      // Pre mobilné zariadenia, vždy aplikujeme custom background
      banner1.style.backgroundImage = "url('img/coconut_core.webp')";
      banner2.style.backgroundImage = "url('img/coconut_core.webp')";
      banner3.style.backgroundImage = "url('img/coconut_core.webp')";
      banner4.style.backgroundImage = "url('img/coconut_core.webp')";

      // Nastavíme scroll pre mobilné zariadenia
      document.querySelectorAll(".section-header").forEach((header) => {
        header.style.backgroundAttachment = "scroll";
      });
    } else if (window.innerWidth <= 1024) {
      // Pre zariadenia s menšou šírkou ako 1024px (napr. zmenšené okno na desktope)
      banner1.style.backgroundImage = "url('img/coconut_core.webp')";
      banner2.style.backgroundImage = "url('img/coconut_core.webp')";
      banner3.style.backgroundImage = "url('img/coconut_core.webp')";
      banner4.style.backgroundImage = "url('img/coconut_core.webp')";

      // Nastavíme scroll pre menšie okná
      document.querySelectorAll(".section-header").forEach((header) => {
        header.style.backgroundAttachment = "scroll";
      });
    } else {
      // Pre všetky ostatné zariadenia (desktop s šírkou nad 1024px)
      banner1.style.backgroundImage = "url('img/coconut_bg.webp')";
      banner2.style.backgroundImage = "url('img/coconut_bg.webp')";
      banner3.style.backgroundImage = "url('img/coconut_bg.webp')";
      banner4.style.backgroundImage = "url('img/coconut_bg.webp')";

      // Ponecháme background-attachment fixed pre desktop
      document.querySelectorAll(".section-header").forEach((header) => {
        header.style.backgroundAttachment = "fixed";
      });
    }
  }

  // Spustíme funkciu na začiatku a pri zmene veľkosti okna (orientácia)
  applyBannerBehavior();
  window.addEventListener("resize", applyBannerBehavior);

  $(window).scroll(function () {
    // Up Button
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show");
    } else {
      $(".scroll-up-btn").removeClass("show");
    }
  });

  // Slide up script
  $(".scroll-up-btn").click(function () {
    $("html").animate({ scrollTop: 0 });
  });

  // Toggle Menu / Navbar script
  $(".menu-btn").click(function () {
    $(".menu").toggleClass("active");
    $(".menu ul").toggleClass("mobile-menu");
    $(".menu-btn i").toggleClass("active");
    // console.log("clicked");
  });
  // Mobile menu close on click
  document.querySelectorAll(".main-header .menu a").forEach((link) => {
    link.addEventListener("click", () => {
      // console.log("clicked");
      $(".menu").removeClass("active");
      $(".menu ul").removeClass("mobile-menu");
      $(".menu-btn i").removeClass("active");
    });
  });

  // offset for section smooth scrolling
  document.querySelectorAll(".main-header .menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor click behavior

      const targetId = this.getAttribute("href");

      if (targetId === "#") {
        // Special behavior for the Home link
        window.scrollTo({
          top: 0, // Scroll to the top
          behavior: "smooth", // Smooth scrolling
        });
      } else {
        // Normal behavior for other links
        const targetElement = document.querySelector(targetId);
        const offset = 95; // Set your desired offset value here

        // Calculate the position to scroll to
        const scrollPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          offset;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
