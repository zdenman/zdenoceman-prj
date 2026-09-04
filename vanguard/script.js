document.addEventListener("DOMContentLoaded", function () {
  const flagHeroReady = () => document.body.classList.add("page-loaded");

  if (document.readyState === "complete") {
    requestAnimationFrame(flagHeroReady);
  } else {
    window.addEventListener("load", flagHeroReady, { once: true });
  }

  // Hero content scroll animation
  const heroContent = document.querySelector(".hero-content");
  let hasAnimated = false;

  function checkScroll() {
    if (hasAnimated) return;

    const rect = heroContent.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger when hero content is 80% into the viewport
    if (rect.top <= windowHeight * 0.8) {
      gsap.fromTo(
        ".hero-content",
        { y: "50px", opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
      hasAnimated = true;
      window.removeEventListener("scroll", checkScroll);
    }
  }

  window.addEventListener("scroll", checkScroll);
  // Check on load in case it's already in view
  checkScroll();

  // Private label spec scroll animation
  const privateLabelSpec = document.querySelector(".private-label-spec");
  let hasAnimatedSpec = false;

  function checkScrollSpec() {
    if (hasAnimatedSpec) return;

    const rect = privateLabelSpec.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger when image is sooner into the viewport
    if (rect.top <= windowHeight * 0.8) {
      privateLabelSpec.classList.add("animate");
      hasAnimatedSpec = true;
      window.removeEventListener("scroll", checkScrollSpec);
    }
  }

  window.addEventListener("scroll", checkScrollSpec);
  // Check on load in case it's already in view
  checkScrollSpec();

  // About Us section title scroll animation
  const aboutTitle = document.querySelector("#about h2");
  let hasAnimatedAbout = false;

  function checkScrollAbout() {
    if (hasAnimatedAbout) return;

    const rect = aboutTitle.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger when title comes into the bottom of the viewport
    if (rect.top <= windowHeight) {
      gsap.fromTo(
        "#about h2",
        { y: "50px", opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
      hasAnimatedAbout = true;
      window.removeEventListener("scroll", checkScrollAbout);
    }
  }

  window.addEventListener("scroll", checkScrollAbout);
  // Check on load in case it's already in view
  checkScrollAbout();

  // Product Lines section title scroll animation
  const productTitle = document.querySelector("#product-text h2");
  let hasAnimatedProduct = false;

  function checkScrollProduct() {
    if (hasAnimatedProduct) return;

    const rect = productTitle.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger when title comes into the bottom of the viewport
    if (rect.top <= windowHeight) {
      gsap.fromTo(
        "#product-text h2",
        { y: "50px", opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
      hasAnimatedProduct = true;
      window.removeEventListener("scroll", checkScrollProduct);
    }
  }

  window.addEventListener("scroll", checkScrollProduct);
  // Check on load in case it's already in view
  checkScrollProduct();

  // About Us images staggered scroll animation
  const aboutImages = document.querySelectorAll(".about-images img");
  let hasAnimatedImages = false;

  function checkScrollImages() {
    if (hasAnimatedImages) return;

    const firstImage = aboutImages[0];
    const rect = firstImage.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger when images are 30% into the viewport from bottom
    if (rect.top <= windowHeight * 0.7) {
      gsap.fromTo(
        ".about-images img",
        {
          y: "60px",
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.2,
        }
      );
      hasAnimatedImages = true;
      window.removeEventListener("scroll", checkScrollImages);
    }
  }

  window.addEventListener("scroll", checkScrollImages);
  // Check on load in case it's already in view
  checkScrollImages();

  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navUl = document.querySelector("nav ul");

  hamburger.addEventListener("click", () => {
    navUl.classList.toggle("open");
    hamburger.classList.toggle("open");
  });

  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  let activeScrollTween = null;
  const originalHtmlScrollBehavior =
    document.documentElement.style.scrollBehavior;
  const originalBodyScrollBehavior = document.body.style.scrollBehavior;

  function disableNativeSmoothScroll() {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
  }

  function restoreNativeSmoothScroll() {
    document.documentElement.style.scrollBehavior = originalHtmlScrollBehavior;
    document.body.style.scrollBehavior = originalBodyScrollBehavior;
  }

  function endScrollTween() {
    activeScrollTween = null;
    restoreNativeSmoothScroll();
  }

  function scrollWithGsap(targetY) {
    if (reduceMotionQuery.matches) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      return;
    }

    if (activeScrollTween) {
      activeScrollTween.kill();
    }

    disableNativeSmoothScroll();

    const tweenState = { value: window.scrollY };

    activeScrollTween = gsap.to(tweenState, {
      value: targetY,
      duration: 1.3,
      ease: "elastic.out(1, 0.7)",
      onUpdate: () =>
        window.scrollTo({ top: tweenState.value, behavior: "auto" }),
      onComplete: endScrollTween,
      onInterrupt: endScrollTween,
    });
  }

  // Zoom-in sections
  const zoomSections = document.querySelectorAll(
    ".image-section, .product-image-section"
  );

  const applyZoomClass = (section) => section.classList.add("is-zoomed");

  if (zoomSections.length) {
    if (reduceMotionQuery.matches) {
      zoomSections.forEach(applyZoomClass);
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              applyZoomClass(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: [0.5] }
      );

      zoomSections.forEach((section) => observer.observe(section));

      reduceMotionQuery.addEventListener(
        "change",
        (event) => {
          if (event.matches) {
            zoomSections.forEach(applyZoomClass);
            observer.disconnect();
          }
        },
        { once: true }
      );
    }
  }

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const targetY =
          targetSection.getBoundingClientRect().top + window.pageYOffset;
        scrollWithGsap(targetY);
      }
      // Close mobile menu after clicking
      navUl.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    if (activeScrollTween) {
      activeScrollTween.kill();
    }

    restoreNativeSmoothScroll();

    const behavior = reduceMotionQuery.matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
});
