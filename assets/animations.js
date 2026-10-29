/**
 * PawCare Veterinary Clinic - Animations Configuration
 * Integrates AOS (Animate On Scroll) & GSAP + ScrollTrigger
 * Bulletproof: Guaranteed visibility so content is never hidden if animations stall.
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initAOS(isReducedMotion);
  initGSAP(isReducedMotion);
  initNumberCounters(isReducedMotion);
  ensureContentVisibility();
});

/* --------------------------------------------------------------------------
   AOS (Animate On Scroll) Initialization
   -------------------------------------------------------------------------- */
function initAOS(reduced) {
  if (reduced) {
    revealAllContent();
    return;
  }

  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 600,
      offset: 30, // Trigger early so content is never delayed
      easing: 'ease-out-cubic',
      disable: false,
      startEvent: 'DOMContentLoaded'
    });

    // Refresh after DOM content and images settle
    window.addEventListener('load', () => {
      AOS.refresh();
    });
  } else {
    // If AOS script failed to load, reveal all content immediately
    revealAllContent();
  }
}

/* --------------------------------------------------------------------------
   Guaranteed Content Visibility Fallback
   Prevents any section content from being permanently hidden at opacity: 0
   -------------------------------------------------------------------------- */
function ensureContentVisibility() {
  // Give AOS a brief moment to calculate on initial viewport,
  // then force reveal anything that hasn't animated so the user never sees blank sections.
  setTimeout(() => {
    revealAllContent();
  }, 400);

  // Also reveal on window scroll as an extra safeguard
  window.addEventListener('scroll', () => {
    revealAllContent();
  }, { once: true, passive: true });
}

function revealAllContent() {
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.classList.add('aos-animate');
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  });
}

/* --------------------------------------------------------------------------
   GSAP & ScrollTrigger Animations
   Focuses on non-conflicting motion: hero parallax, floating badges & counters.
   -------------------------------------------------------------------------- */
function initGSAP(reduced) {
  if (reduced) return;
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Image Subtle Parallax Layer
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

  // Floating Badges continuous gentle float (independent of opacity)
  const badges = document.querySelectorAll('.floating-badge');
  badges.forEach((b, i) => {
    gsap.to(b, {
      y: (i % 2 === 0 ? -10 : 10),
      duration: 3 + (i * 0.4),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  });
}

/* --------------------------------------------------------------------------
   Animated Number Counters for Clinic Statistics
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
        const duration = reduced ? 0 : 1600;

        if (reduced) {
          el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          obs.unobserve(el);
          return;
        }

        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = (easeProgress * target).toFixed(decimals);
          el.textContent = `${prefix}${parseFloat(currentVal).toLocaleString()}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        window.requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}
