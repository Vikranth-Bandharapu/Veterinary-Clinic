/**
 * PawCare Veterinary Clinic - Advanced GSAP 3 & ScrollTrigger Suite
 * Award-winning fluid motion experience:
 * - Top dynamic reading/scroll progress bar
 * - Cinematic page entrance timeline (staggered hero, titles, CTAs, trust metrics, 3D frames)
 * - Spring-physics floating badges & continuous gentle ambient motion
 * - ScrollTrigger staggered card reveals (.vet-card, .service-card, .journal-card, .testimonial-card, etc.)
 * - ScrollTrigger editorial split reveals with directional parallax
 * - Interactive GSAP micro-interactions (magnetic hover elevation on cards & buttons)
 * - GSAP-powered smooth statistics number counter tweening
 * - Fail-safe visibility guarantee
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initScrollProgressBar(isReducedMotion);
  initGSAP(isReducedMotion);
  initNumberCounters(isReducedMotion);
  initCardInteractions(isReducedMotion);
  initButtonInteractions(isReducedMotion);
});

/* --------------------------------------------------------------------------
   0. Scroll Progress Bar at Window Top
   -------------------------------------------------------------------------- */
function initScrollProgressBar(reduced) {
  if (reduced) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  let bar = document.querySelector('.gsap-scroll-progress');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'gsap-scroll-progress';
    document.body.prepend(bar);
  }

  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
}

/* --------------------------------------------------------------------------
   GSAP & ScrollTrigger Master Controller
   -------------------------------------------------------------------------- */
function initGSAP(reduced) {
  if (reduced) return;
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero Cinematic Entrance Timeline
  initHeroEntrance();

  // 2. Ambient Continuous Floating Physics
  initFloatingBadges();

  // 3. ScrollTrigger Section Header Reveals
  initSectionHeaders();

  // 4. ScrollTrigger Staggered Card Grids
  initCardGrids();

  // 5. ScrollTrigger Editorial Grid Splits
  initEditorialGrids();

  // 6. ScrollTrigger CTA Banners & Form Cards
  initCTABannersAndForms();
}

/* --------------------------------------------------------------------------
   1. Hero Section Cinematic Entrance Timeline
   -------------------------------------------------------------------------- */
function initHeroEntrance() {
  const heroWrapper = document.querySelector('.hero-wrapper, .page-hero');
  if (!heroWrapper) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Top site header drop
  const header = document.querySelector('.site-header');
  if (header) {
    tl.from(header, {
      y: -35,
      opacity: 0,
      duration: 0.75
    }, 0);
  }

  // Hero Pill / Badge
  const heroTag = heroWrapper.querySelector('.hero-badge-pill, .section-tag, .hero-tag, .badge-pill');
  if (heroTag) {
    tl.from(heroTag, {
      y: 25,
      scale: 0.85,
      opacity: 0,
      duration: 0.65,
      ease: 'back.out(1.8)'
    }, '-=0.4');
  }

  // Hero Main Heading
  const heroTitle = heroWrapper.querySelector('.hero-title, h1');
  if (heroTitle) {
    tl.from(heroTitle, {
      y: 45,
      opacity: 0,
      duration: 0.9,
      ease: 'power4.out'
    }, '-=0.45');
  }

  // Hero Subtitle / Description
  const heroDesc = heroWrapper.querySelector('.hero-description, .hero-subtitle, .lead-text, p');
  if (heroDesc) {
    tl.from(heroDesc, {
      y: 30,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out'
    }, '-=0.55');
  }

  // Hero CTA Buttons (Spring bounce)
  const heroCtas = heroWrapper.querySelectorAll('.hero-cta-group .btn, .hero-actions .btn, .cta-group .btn');
  if (heroCtas.length > 0) {
    tl.from(heroCtas, {
      y: 25,
      scale: 0.9,
      opacity: 0,
      stagger: 0.12,
      duration: 0.65,
      ease: 'back.out(1.6)'
    }, '-=0.45');
  }

  // Hero Trust Metrics (Avatars + Text)
  const trustMetrics = heroWrapper.querySelectorAll('.hero-trust-metrics, .hero-trust-avatars img, .trust-metric-item');
  if (trustMetrics.length > 0) {
    tl.from(trustMetrics, {
      x: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.35');
  }

  // Hero Visual 3D Frame & Image
  const heroVisual = heroWrapper.querySelector('.hero-visual-frame');
  if (heroVisual) {
    tl.from(heroVisual, {
      scale: 0.94,
      y: 35,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all'
    }, '-=0.6');
  }

  // Hero Floating Badges (Spring pop-in)
  const heroBadges = heroWrapper.querySelectorAll('.floating-badge');
  if (heroBadges.length > 0) {
    tl.from(heroBadges, {
      scale: 0.2,
      opacity: 0,
      stagger: 0.2,
      duration: 0.75,
      ease: 'back.out(2)',
      clearProps: 'transform,opacity'
    }, '-=0.5');
  }
}

/* --------------------------------------------------------------------------
   2. Floating Badges Continuous Gentle Ambient Motion
   -------------------------------------------------------------------------- */
function initFloatingBadges() {
  const badges = document.querySelectorAll('.floating-badge');
  badges.forEach((b, i) => {
    gsap.to(b, {
      y: (i % 2 === 0 ? -12 : 12),
      duration: 3.2 + (i * 0.5),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  });

  // Hero Image Subtle Parallax on Scroll
  const heroImage = document.querySelector('.hero-visual-frame img');
  if (heroImage && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroImage, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-wrapper',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. ScrollTrigger Section Header Reveals
   -------------------------------------------------------------------------- */
function initSectionHeaders() {
  if (typeof ScrollTrigger === 'undefined') return;

  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    const children = header.querySelectorAll('.section-tag, .section-title, .section-subtitle');
    if (children.length === 0) return;

    gsap.from(children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  });
}

/* --------------------------------------------------------------------------
   4. ScrollTrigger Staggered Card Grids
   -------------------------------------------------------------------------- */
function initCardGrids() {
  if (typeof ScrollTrigger === 'undefined') return;

  const gridSelectors = [
    { container: '.vet-grid', item: '.vet-card' },
    { container: '.service-grid', item: '.service-card' },
    { container: '.testimonial-grid', item: '.testimonial-card' },
    { container: '.journal-grid', item: '.journal-card' },
    { container: '.step-journey-grid', item: '.step-journey-card, .step-item' },
    { container: '.feature-grid', item: '.feature-card, .paw-card' },
    { container: '.responsive-3-col', item: '.paw-card' }
  ];

  gridSelectors.forEach(({ container, item }) => {
    document.querySelectorAll(container).forEach(grid => {
      const cards = grid.querySelectorAll(item);
      if (cards.length === 0) return;

      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.14,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. ScrollTrigger Editorial Grid Splits
   -------------------------------------------------------------------------- */
function initEditorialGrids() {
  if (typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.editorial-grid').forEach(grid => {
    const visual = grid.querySelector('.editorial-visual');
    const content = grid.querySelector('.editorial-content');
    const isReversed = grid.classList.contains('reversed');

    if (visual) {
      gsap.from(visual, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        x: isReversed ? 50 : -50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });
    }

    if (content) {
      const checklistItems = content.querySelectorAll('.feature-check-item');
      gsap.from(content, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        x: isReversed ? -50 : 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });

      if (checklistItems.length > 0) {
        gsap.from(checklistItems, {
          scrollTrigger: {
            trigger: content,
            start: 'top 78%',
            toggleActions: 'play none none none'
          },
          y: 20,
          opacity: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        });
      }
    }
  });
}

/* --------------------------------------------------------------------------
   6. ScrollTrigger CTA Banners & Form Cards
   -------------------------------------------------------------------------- */
function initCTABannersAndForms() {
  if (typeof ScrollTrigger === 'undefined') return;

  // CTA Banners
  document.querySelectorAll('.cta-banner-wrap').forEach(banner => {
    gsap.from(banner, {
      scrollTrigger: {
        trigger: banner,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      scale: 0.94,
      y: 40,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  });

  // Form Cards
  document.querySelectorAll('.form-card').forEach(form => {
    gsap.from(form, {
      scrollTrigger: {
        trigger: form,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive GSAP Card Hover Micro-Interactions
   -------------------------------------------------------------------------- */
function initCardInteractions(reduced) {
  if (reduced) return;
  if (typeof gsap === 'undefined') return;

  const cards = document.querySelectorAll('.paw-card, .vet-card, .service-card, .journal-card, .editorial-image-wrapper');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        scale: 1.015,
        duration: 0.28,
        ease: 'power2.out',
        boxShadow: '0 16px 36px -6px rgba(27, 67, 50, 0.16)'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: 'power2.out',
        clearProps: 'boxShadow'
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Interactive GSAP Button Micro-Interactions
   -------------------------------------------------------------------------- */
function initButtonInteractions(reduced) {
  if (reduced) return;
  if (typeof gsap === 'undefined') return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-accent');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        scale: 1.04,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. Animated Number Counters Powered by GSAP Tweening
   -------------------------------------------------------------------------- */
function initNumberCounters(reduced) {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);

        if (reduced || typeof gsap === 'undefined') {
          el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          obs.unobserve(el);
          return;
        }

        const countObj = { val: 0 };
        gsap.to(countObj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${parseFloat(countObj.val.toFixed(decimals)).toLocaleString()}${suffix}`;
          },
          onComplete: () => {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        });

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}
