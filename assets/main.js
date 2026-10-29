/**
 * PawCare Veterinary Clinic - Main JavaScript
 * Interactive UI, Mobile Nav, Accordions, Toasts, 3D Card Tilt, CTA Routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initAccordions();
  init3DCardTilt();
  initModals();
  initNewsletterForm();
  initCTARuleAudit();
  initCurrentYear();
  initFailsafeVisibility();
});

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer (With Background Scroll Locking)
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  let savedScrollY = 0;

  function openDrawer() {
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop;
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');

    // Fix the background so it cannot scroll at all
    document.documentElement.classList.add('drawer-open');
    document.body.classList.add('drawer-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');

    // Restore background scrolling and exact scroll position
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('drawer-open');
    document.body.classList.remove('drawer-open');

    window.scrollTo(0, savedScrollY);
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
    backdrop.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   Sticky Header on Scroll
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Interactive Accordions (FAQs)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close sibling items in the same container
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const sibBody = sibling.querySelector('.accordion-body');
            if (sibBody) sibBody.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Tasteful 3D Card Tilt on Mouse Move
   -------------------------------------------------------------------------- */
function init3DCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return; // Only on desktop pointers

  const tiltCards = document.querySelectorAll('.tilt-card, .paw-card, .vet-card, .hero-visual-frame');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   Global Toast Notification System
   -------------------------------------------------------------------------- */
window.showToast = function(message, type = 'info', title = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const defaultTitles = {
    success: 'Success',
    error: 'Notice',
    warning: 'Attention',
    info: 'Information'
  };

  const toast = document.createElement('div');
  toast.className = `paw-toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${title || defaultTitles[type]}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Close notification">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 200);
    }
  }, 4500);
};

/* --------------------------------------------------------------------------
   Modal Dialogs
   -------------------------------------------------------------------------- */
function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    const closeBtns = modal.querySelectorAll('.modal-close-btn, [data-modal-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Newsletter Subscription Handler
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim() || !/^\S+@\S+\.\S+$/.test(input.value.trim())) {
        window.showToast('Please provide a valid email address to subscribe.', 'warning', 'Invalid Email');
        return;
      }

      window.showToast(
        `Thank you! "${input.value.trim()}" has been added to the PawCare Pet Journal digest (Demo).`,
        'success',
        'Subscribed!'
      );
      input.value = '';
    });
  });
}

/* --------------------------------------------------------------------------
   MANDATORY CTA RULE AUDIT & REDIRECT ENFORCER
   Only empty links ('#') or promotional action buttons redirect to 404.html.
   Core functional navigation (Login, Sign Up, Home, Services, etc.) MUST NEVER be blocked!
   -------------------------------------------------------------------------- */
function initCTARuleAudit() {
  const allLinks = document.querySelectorAll('a');

  const functionalPages = [
    'login.html',
    'signup.html',
    'index.html',
    'services.html',
    'about.html',
    'blog.html',
    'contact.html',
    'appointment.html',
    'admin-dashboard.html',
    'vet-dashboard.html'
  ];

  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Disallow empty links or '#'
    if (!href || href === '#' || href === '#!') {
      link.setAttribute('href', '404.html');
      return;
    }

    // Preserve legitimate functional pages (Login, Sign Up, Main Nav, Dashboards)
    const isFunctional = functionalPages.some(page => href.includes(page));
    if (isFunctional) {
      return;
    }

    // If it's a normal promotional CTA button or card link without a functional destination, route to 404.html
    const isCtaButton = link.classList.contains('btn') || link.classList.contains('paw-card-link');
    const isNavLink = link.classList.contains('nav-link');
    const isBrand = link.classList.contains('brand-logo') || link.classList.contains('sidebar-brand');
    const isRecovery = link.closest('.error-btn-group');

    if (isCtaButton && !isNavLink && !isBrand && !isRecovery) {
      if (window.location.pathname.endsWith('404.html')) return;
      link.setAttribute('href', '404.html');
    }
  });
}

/* --------------------------------------------------------------------------
   Dynamic Current Year
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = currentYear;
  });
}

/* --------------------------------------------------------------------------
   Failsafe Content Visibility
   Guarantees that section content is immediately visible across all devices
   -------------------------------------------------------------------------- */
function initFailsafeVisibility() {
  if (typeof AOS !== 'undefined' && typeof window.__pawcare_aos_initialized === 'undefined') {
    try {
      AOS.init({ once: true, duration: 600, offset: 20 });
      window.__pawcare_aos_initialized = true;
    } catch (e) {}
  }
  setTimeout(() => {
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.classList.add('aos-animate');
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }, 300);
}
