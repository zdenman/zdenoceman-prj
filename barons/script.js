document.addEventListener("DOMContentLoaded", () => {
  // User Agent/Platform Detection: Check for iOS device (iPad, iPhone, iPod) AND non-desktop Safari
  // This detection will determine if we bypass the scroll sync logic.
  const IS_IOS_SAFARI =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream &&
    (!!window.indexedDB ||
      (/webkit/i.test(navigator.appVersion) &&
        !/chrome|samsungbrowser/i.test(navigator.userAgent)));

  // Fix iOS Safari vh issue by dynamically setting --vh
  function setVh() {
    // Disable active section updating logic on iOS Safari via a class
    if (document.body.classList) {
      if (IS_IOS_SAFARI) {
        document.body.classList.add("ios-safari");
        console.log(
          "iOS Safari detected. Disabling active navigation dot updates."
        );
      } else {
        document.body.classList.remove("ios-safari");
      }
    }

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setVh();

  const vhWidthThreshold = 5;
  let lastViewportWidth = window.innerWidth;

  function handleViewportResize(force = false) {
    if (!force) {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - lastViewportWidth) < vhWidthThreshold) {
        return;
      }
      lastViewportWidth = currentWidth;
    }

    // Avoid triggering layout shifts with --vh updates on iOS Safari
    if (!IS_IOS_SAFARI) {
      setVh();
    }
  }

  window.addEventListener("resize", () => handleViewportResize());

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      lastViewportWidth = window.innerWidth;
      handleViewportResize(true);
    }, 150);
  });

  if (window.visualViewport) {
    let lastVisualWidth = window.visualViewport.width;

    window.visualViewport.addEventListener("resize", () => {
      const currentVisualWidth = window.visualViewport.width;
      if (Math.abs(currentVisualWidth - lastVisualWidth) < vhWidthThreshold) {
        return;
      }

      lastVisualWidth = currentVisualWidth;
      handleViewportResize(true);
    });
  }

  // Elements
  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelectorAll(
    ".main-nav__link, .nav-dots__link"
  );
  // const scrollTopBtn = document.querySelector('.scroll-top');
  const sections = document.querySelectorAll("section");
  const navDots = document.querySelectorAll(".nav-dots__link");
  const loader = document.querySelector(".loader");

  // Handle page loader with a delay for mobile
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const loaderDelay = isMobile ? 1800 : 800; // Longer delay on mobile

  // Hide loader after timeout
  setTimeout(() => {
    if (loader) {
      loader.classList.add("loader--hidden");

      // Remove loader from DOM after transition completes
      loader.addEventListener("transitionend", () => {
        loader.remove();
      });
    }
  }, loaderDelay);

  // Set first dot as active initially
  if (navDots.length > 0) {
    navDots[0].classList.add("nav-dots__link--active");
  }

  // Create mobile menu dynamically
  createMobileMenu();

  // Initialize Justified Gallery
  if ($("#justified-gallery").length) {
    // Determine row height and margins based on screen size
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    ).matches;

    // Responsive settings
    let rowHeight, margins, maxRowHeight, lastRow;

    if (isMobile) {
      rowHeight = 120; // Smaller height for mobile
      margins = 3; // Consistent small margins on mobile
      maxRowHeight = 200;
      lastRow = "hide"; // Hide last row
    } else if (isTablet) {
      rowHeight = 300; // Medium height for tablets
      margins = 10; // Medium margins on tablets
      maxRowHeight = 350;
      lastRow = "justify";
    } else {
      rowHeight = 500; // Larger height for desktop
      margins = 20; // Larger margins on desktop
      maxRowHeight = 600;
      lastRow = "justify";
    }

    $("#justified-gallery")
      .justifiedGallery({
        rowHeight: rowHeight,
        margins: margins,
        lastRow: lastRow,
        border: 0,
        randomize: false,
        maxRowHeight: maxRowHeight,
      })
      .on("jg.complete", function () {
        // Configure lightbox options
        lightbox.option({
          resizeDuration: 300,
          wrapAround: true,
          disableScrolling: true,
          fadeDuration: 300,
          imageFadeDuration: 300,
          alwaysShowNavOnTouchDevices: false,
          albumLabel: "Obrázok %1 z %2",
          maxWidth: isMobile
            ? window.innerWidth * 0.95
            : window.innerWidth * 0.8,
          maxHeight: isMobile
            ? window.innerHeight * 0.95
            : window.innerHeight * 0.8,
          showImageNumberLabel: true,
          positionFromTop: 50,
        });

        // Add data-lightbox attribute to gallery items
        $(".gallery-item").each(function () {
          $(this).attr("data-lightbox", "gallery");
          $(this).attr("data-title", "Baron's Barbery");
        });

        // Add mobile class for styling purposes
        if (isMobile) {
          $(".gallery-item").addClass("gallery-item--mobile");
        }

        // Add touch swipe support for lightbox
        $(document).on("touchstart", ".lb-container", function (e) {
          // Store touch start position only for touch events
          if (e.originalEvent.touches) {
            this.touchStartX = e.originalEvent.touches[0].pageX;
            this.touchStartY = e.originalEvent.touches[0].pageY;
          }
        });

        $(document).on("touchend", ".lb-container", function (e) {
          // Only process if we have both touch start and end coordinates from a real touch event
          if (
            e.originalEvent.changedTouches &&
            this.touchStartX !== undefined &&
            this.touchStartY !== undefined
          ) {
            const touchEndX = e.originalEvent.changedTouches[0].pageX;
            const touchEndY = e.originalEvent.changedTouches[0].pageY;
            const touchDistX = touchEndX - this.touchStartX;
            const touchDistY = touchEndY - this.touchStartY;

            // Detect swipe direction
            if (Math.abs(touchDistX) > Math.abs(touchDistY)) {
              // Horizontal swipe
              if (touchDistX > 50) {
                // Swipe right - go to previous image
                if (typeof lightbox.prev === "function") {
                  lightbox.prev();
                }
              } else if (touchDistX < -50) {
                // Swipe left - go to next image
                if (typeof lightbox.next === "function") {
                  lightbox.next();
                }
              }
            } else {
              // Vertical swipe
              if (Math.abs(touchDistY) > 50) {
                // Swipe up or down - close
                if (typeof lightbox.end === "function") {
                  lightbox.end();
                }
              }
            }
          }
        });
      });
  }

  // Events
  window.addEventListener("scroll", function () {
    handleHeaderScroll();

    // Call updateActiveSection only if client-side check shows it's NOT iOS Safari
    if (!document.body.classList.contains("ios-safari")) {
      updateActiveSection();
    }
  });

  // Add another direct scroll listener just to be sure
  document.addEventListener("scroll", function () {
    if (!document.body.classList.contains("ios-safari")) {
      updateActiveSection();
    }
  });

  // Handle window resize for responsive gallery
  $(window).on("resize", function () {
    // Aggressively bypass gallery recalculation on iOS Safari to prevent layout shifts
    if (IS_IOS_SAFARI) {
      // Still update lightbox options if needed, but no gallery destroy/reinit
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (typeof lightbox !== "undefined" && lightbox.option) {
        lightbox.option({
          maxWidth: isMobile
            ? window.innerWidth * 0.95
            : window.innerWidth * 0.8,
          maxHeight: isMobile
            ? window.innerHeight * 0.95
            : window.innerHeight * 0.8,
        });
      }
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    ).matches;

    // Update lightbox options
    lightbox.option({
      maxWidth: isMobile ? window.innerWidth * 0.95 : window.innerWidth * 0.8,
      maxHeight: isMobile
        ? window.innerHeight * 0.95
        : window.innerHeight * 0.8,
    });

    // Reinitialize justifiedGallery for all devices
    if ($("#justified-gallery").length) {
      // Responsive settings
      let rowHeight, margins, maxRowHeight, lastRow;

      if (isMobile) {
        rowHeight = 120; // Smaller height for mobile
        margins = 3; // Consistent small margins on mobile
        maxRowHeight = 200;
        lastRow = "hide"; // Hide last row
      } else if (isTablet) {
        rowHeight = 300; // Medium height for tablets
        margins = 10; // Medium margins on tablets
        maxRowHeight = 350;
        lastRow = "justify";
      } else {
        rowHeight = 500; // Larger height for desktop
        margins = 20; // Larger margins on desktop
        maxRowHeight = 600;
        lastRow = "justify";
      }

      // Reinitialize the gallery with new settings
      $("#justified-gallery").justifiedGallery("destroy");
      $("#justified-gallery")
        .justifiedGallery({
          rowHeight: rowHeight,
          margins: margins,
          lastRow: lastRow,
          border: 0,
          randomize: false,
          maxRowHeight: maxRowHeight,
        })
        .on("jg.complete", function () {
          // Update data-lightbox attribute to gallery items if needed
          $(".gallery-item").each(function () {
            if (!$(this).attr("data-lightbox")) {
              $(this).attr("data-lightbox", "gallery");
              $(this).attr("data-title", "Baron's Barbery");
            }
          });

          // Add mobile class for styling purposes
          if (isMobile) {
            $(".gallery-item").addClass("gallery-item--mobile");
          } else {
            $(".gallery-item").removeClass("gallery-item--mobile");
          }
        });
    }
  });

  hamburger.addEventListener("click", toggleMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavLinkClick);
  });

  // Get header height from CSS variable
  function getHeaderHeight() {
    const headerHeightCSS = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-height")
      .trim();
    return parseInt(headerHeightCSS) || 100; // Default to 100px if variable can't be parsed
  }

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  function createMobileMenu() {
    // Create mobile menu
    const mobileMenu = document.createElement("div");
    mobileMenu.classList.add("mobile-menu");

    // Clone navigation items
    const navList = document.querySelector(".main-nav__list");
    const mobileNavList = document.createElement("ul");
    mobileNavList.classList.add("mobile-menu__list");

    // Clone each nav item
    navList.querySelectorAll(".main-nav__item").forEach((item) => {
      const link = item.querySelector(".main-nav__link");
      const mobileItem = document.createElement("li");
      mobileItem.classList.add("mobile-menu__item");

      const mobileLink = document.createElement("a");
      mobileLink.classList.add("mobile-menu__link");
      mobileLink.textContent = link.textContent;
      mobileLink.href = link.href;

      mobileLink.addEventListener("click", handleNavLinkClick);

      mobileItem.appendChild(mobileLink);
      mobileNavList.appendChild(mobileItem);
    });

    mobileMenu.appendChild(mobileNavList);
    document.body.appendChild(mobileMenu);
  }

  function toggleMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    hamburger.classList.toggle("hamburger--active");
    mobileMenu.classList.toggle("mobile-menu--active");

    // Toggle aria-expanded
    const expanded =
      hamburger.getAttribute("aria-expanded") === "true" || false;
    hamburger.setAttribute("aria-expanded", !expanded);

    // Prevent scrolling when menu is open
    document.body.style.overflow = hamburger.classList.contains(
      "hamburger--active"
    )
      ? "hidden"
      : "";
  }

  function handleNavLinkClick(e) {
    e.preventDefault();
    const isMobileLink =
      e.currentTarget.classList.contains("mobile-menu__link");

    // Get the target section from the href, extracting just the ID part if it's a full URL
    let targetId = e.currentTarget.getAttribute("href");

    // Extract the fragment identifier from potentially full URLs
    if (targetId.includes("#")) {
      targetId = "#" + targetId.split("#")[1];
    }

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Get header height to use as offset
      const headerHeight = getHeaderHeight();

      // Calculate the position to scroll to
      const targetPosition = targetSection.offsetTop - headerHeight;

      // If this is a nav dot, update the active state immediately
      if (e.currentTarget.classList.contains("nav-dots__link")) {
        // Remove active class from all dots
        navDots.forEach((dot) =>
          dot.classList.remove("nav-dots__link--active")
        );

        // Add active class to clicked dot
        e.currentTarget.classList.add("nav-dots__link--active");
      }

      // Close mobile menu AFTER getting the target position but BEFORE scrolling
      if (isMobileLink) {
        toggleMobileMenu();

        // Add a small delay to ensure the menu is closed before scrolling
        setTimeout(() => {
          // Disable smooth scroll on iOS Safari to prevent jumping
          window.scrollTo({
            top: targetPosition,
            behavior: IS_IOS_SAFARI ? "auto" : "smooth",
          });
        }, 100);
      } else {
        // Disable smooth scroll on iOS Safari to prevent jumping
        window.scrollTo({
          top: targetPosition,
          behavior: IS_IOS_SAFARI ? "auto" : "smooth",
        });
      }
    }
  }

  function updateActiveSection() {
    // Get viewport measurements
    const scrollY = window.scrollY || window.pageYOffset;
    const headerHeight = getHeaderHeight();

    // Track which section is most visible
    let mostVisibleSection = 0;
    let maxVisibility = 0;

    // Calculate the middle point of the viewport
    const viewportMiddle = scrollY + window.innerHeight / 2;

    // Check each section
    sections.forEach((section, index) => {
      // Get section position
      const sectionTop = section.offsetTop - headerHeight;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      // Simple approach: if middle of viewport is in this section, it's active
      if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
        mostVisibleSection = index;
      }

      // Special case for last section when we reach bottom of page
      if (
        index === sections.length - 1 &&
        window.innerHeight + scrollY >= document.body.offsetHeight - 50
      ) {
        mostVisibleSection = index;
      }
    });

    // Update all the navigation dots
    navDots.forEach((dot, index) => {
      if (index === mostVisibleSection) {
        dot.classList.add("nav-dots__link--active");
      } else {
        dot.classList.remove("nav-dots__link--active");
      }
    });
  }

  // Initialize
  handleHeaderScroll();
  // handleScrollTopButton();

  // Set the first dot as active initially
  if (navDots.length > 0) {
    navDots[0].classList.add("nav-dots__link--active");
  }

  // Call updateActiveSection initially
  updateActiveSection();

  // Run again after a delay to ensure everything is calculated correctly
  setTimeout(updateActiveSection, 100);
  setTimeout(updateActiveSection, 500);
  setTimeout(updateActiveSection, 1000);

  // Update on resize
  window.addEventListener("resize", updateActiveSection);

  // GSAP text animations
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".cash-only", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top 50%",
      end: "bottom 50%",
      toggleActions: "play none none none",
      once: true, // Ensures the animation happens only once
    },
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "back.out(1)",
  });

  gsap.from(".about .section-title", {
    scrollTrigger: {
      trigger: ".about .section-title",
      start: "top 95%",
      end: "bottom 5%",
      toggleActions: "play none none none",
      once: true, // Ensures the animation happens only once
    },
    opacity: 0,
    y: 100,
    duration: 0.8,
    ease: "none",
  });

  gsap.from(".services .section-title", {
    scrollTrigger: {
      trigger: ".services .section-title",
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none none",
      once: true, // Ensures the animation happens only once
    },
    opacity: 0,
    x: -150,
    duration: 1.5,
    ease: "power1.out",
  });

  gsap.from(".gallery .section-title", {
    scrollTrigger: {
      trigger: ".gallery .section-title",
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none none",
      once: true, // Ensures the animation happens only once
    },
    opacity: 0,
    x: 150,
    duration: 1.5,
    ease: "power1.out",
  });

  // Create a timeline
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".contact",
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none none",
      once: true,
    },
  });

  // Add animations to the timeline
  tl.from(".col1", {
    opacity: 0,
    y: 100,
    duration: 0.5,
    ease: "none",
  })
    .from(".col2", {
      opacity: 0,
      y: 100,
      duration: 0.5,
      ease: "none",
    })
    .from(".col3", {
      opacity: 0,
      y: 100,
      duration: 0.5,
      ease: "none",
    });
});
