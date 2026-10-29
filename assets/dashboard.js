/**
 * PawCare Veterinary Clinic - Dashboard Interactions
 * Supports both Clinic Operations Dashboard (Admin) & Veterinary Care Workspace (Vet)
 * Includes tab switching, dynamic login email display, form validation with 404 redirect, and CTA 404 routing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initSidebarToggle();
  populateDashboardUserEmail();
  initDashboardForms();
  initDashboardCTAButtons();
  initEmailCenter();
  initPatientModalInspection();
  initDashboardSearch();
});

/* --------------------------------------------------------------------------
   Populate Entered Login Email across Dashboard
   -------------------------------------------------------------------------- */
function populateDashboardUserEmail() {
  const savedEmail = localStorage.getItem('pawcare_logged_in_email') || 
                     sessionStorage.getItem('pawcare_logged_in_email');
  if (!savedEmail) return;

  // Update sidebar user email display
  document.querySelectorAll('.sidebar-user-email, [data-user-email]').forEach(el => {
    el.textContent = savedEmail;
    el.setAttribute('title', savedEmail);
  });

  // Update settings inputs with user email
  document.querySelectorAll('.sidebar-user-email-input, #adminNotificationEmail, #vetNotificationEmail, #vetEmailInput').forEach(input => {
    input.value = savedEmail;
  });
}
window.populateDashboardUserEmail = populateDashboardUserEmail;

/* --------------------------------------------------------------------------
   Sidebar Navigation & Tab Panels (5 Core Sections + Global Switcher)
   -------------------------------------------------------------------------- */
function switchDashboardTab(targetTab) {
  if (!targetTab) return;
  const navItems = document.querySelectorAll('.dash-sidebar [data-tab]');
  const panels = document.querySelectorAll('.dash-view-panel');

  // Update active state in sidebar
  navItems.forEach(nav => {
    if (nav.getAttribute('data-tab') === targetTab) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  // Activate target panel
  panels.forEach(panel => {
    if (panel.id === targetTab) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Update topbar breadcrumb text
  const activeNav = document.querySelector(`.dash-sidebar [data-tab="${targetTab}"]`);
  const titleEl = document.querySelector('.dash-breadcrumb-current');
  if (titleEl) {
    if (activeNav && activeNav.querySelector('span')) {
      titleEl.textContent = activeNav.querySelector('span').textContent;
    } else {
      const cleanName = targetTab.replace(/^tab-(?:vet-)?/, '').replace(/^\w/, c => c.toUpperCase());
      titleEl.textContent = cleanName;
    }
  }

  // Close mobile sidebar if open
  if (window.innerWidth < 1024) {
    closeDashboardSidebar();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchDashboardTab = switchDashboardTab;

function initDashboardTabs() {
  // Support clicking any element with data-tab
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-tab]');
    if (trigger) {
      e.preventDefault();
      const targetTab = trigger.getAttribute('data-tab');
      if (targetTab) {
        switchDashboardTab(targetTab);
      }
    }
  });
}

/* --------------------------------------------------------------------------
   Mobile Sidebar Toggle with Fixed Background Scroll Lock
   -------------------------------------------------------------------------- */
let savedDashScrollY = 0;

function openDashboardSidebar() {
  const sidebar = document.querySelector('.dash-sidebar');
  let backdrop = document.querySelector('.dash-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'dash-sidebar-backdrop';
    backdrop.id = 'dashSidebarBackdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeDashboardSidebar);
  }

  savedDashScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  if (sidebar) sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('active');

  // Freeze the background completely so it cannot scroll at all
  document.documentElement.classList.add('dash-sidebar-open');
  document.body.classList.add('dash-sidebar-open');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedDashScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}
window.openDashboardSidebar = openDashboardSidebar;

function closeDashboardSidebar() {
  const sidebar = document.querySelector('.dash-sidebar');
  const backdrop = document.querySelector('.dash-sidebar-backdrop');

  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');

  // Restore background scrolling and exact scroll position
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  document.documentElement.classList.remove('dash-sidebar-open');
  document.body.classList.remove('dash-sidebar-open');

  window.scrollTo(0, savedDashScrollY);
}
window.closeDashboardSidebar = closeDashboardSidebar;

function initSidebarToggle() {
  const toggleBtn = document.querySelector('.dash-sidebar-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  let backdrop = document.querySelector('.dash-sidebar-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'dash-sidebar-backdrop';
    backdrop.id = 'dashSidebarBackdrop';
    document.body.appendChild(backdrop);
  }

  backdrop.addEventListener('click', () => {
    closeDashboardSidebar();
  });
  backdrop.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  const closeBtns = document.querySelectorAll('.dash-sidebar-close');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDashboardSidebar();
    });
  });

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('open')) {
        closeDashboardSidebar();
      } else {
        openDashboardSidebar();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 1024 && 
          !sidebar.contains(e.target) && 
          !toggleBtn.contains(e.target) && 
          sidebar.classList.contains('open')) {
        closeDashboardSidebar();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeDashboardSidebar();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Dashboard Forms Validation -> Redirect to 404
   -------------------------------------------------------------------------- */
function initDashboardForms() {
  // Admin Settings Form
  const adminSettingsForm = document.getElementById('adminSettingsForm');
  if (adminSettingsForm) {
    adminSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('adminClinicName');
      const hoursInput = document.getElementById('adminOperatingHours');
      const emailInput = document.getElementById('adminNotificationEmail');

      // Clear errors
      adminSettingsForm.querySelectorAll('.form-error-msg').forEach(el => el.textContent = '');
      adminSettingsForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

      if (nameInput && !nameInput.value.trim()) {
        showDashFieldError(nameInput, 'Clinic Trading Name is required.');
        isValid = false;
      }

      if (hoursInput && !hoursInput.value.trim()) {
        showDashFieldError(hoursInput, 'Operating hours notice is required.');
        isValid = false;
      }

      if (emailInput) {
        const emailVal = emailInput.value.trim();
        if (!emailVal) {
          showDashFieldError(emailInput, 'Notification email is required.');
          isValid = false;
        } else if (!emailVal.includes('@') || !emailVal.includes('.')) {
          showDashFieldError(emailInput, 'Please enter a valid email address.');
          isValid = false;
        }
      }

      if (!isValid) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fix the highlighted errors before saving.', 'error', 'Validation Error');
        }
        return;
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Settings validated successfully. Redirecting...', 'success', 'Saved');
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 500);
    });
  }

  // Veterinarian SOAP Notes Form
  const soapForm = document.getElementById('soapConsultationForm');
  if (soapForm) {
    soapForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const subjective = document.getElementById('soapSubjective');
      const objective = document.getElementById('soapObjective');
      const assessment = document.getElementById('soapAssessment');
      const plan = document.getElementById('soapPlan');

      // Clear previous error states
      soapForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

      if (assessment && !assessment.value.trim()) {
        assessment.classList.add('is-invalid');
        isValid = false;
      }

      if (plan && !plan.value.trim()) {
        plan.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fill out the Assessment and Care Plan sections.', 'error', 'Validation Error');
        }
        return;
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Clinical record validated and signed. Redirecting...', 'success', 'Record Saved');
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 500);
    });
  }

  // Veterinarian Settings Form
  const vetSettingsForm = document.getElementById('vetSettingsForm');
  if (vetSettingsForm) {
    vetSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const intervalSelect = document.getElementById('vetInterval');
      const emailInput = document.getElementById('vetNotificationEmail');
      const sigInput = document.getElementById('vetAutoSignature');

      vetSettingsForm.querySelectorAll('.form-error-msg').forEach(el => el.textContent = '');
      vetSettingsForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

      if (intervalSelect && !intervalSelect.value) {
        showDashFieldError(intervalSelect, 'Please select a default consultation interval.');
        isValid = false;
      }

      if (emailInput) {
        const emailVal = emailInput.value.trim();
        if (!emailVal || !emailVal.includes('@')) {
          showDashFieldError(emailInput, 'Please provide a valid clinician email.');
          isValid = false;
        }
      }

      if (sigInput && !sigInput.value.trim()) {
        showDashFieldError(sigInput, 'Clinical signature line is required.');
        isValid = false;
      }

      if (!isValid) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please correct form errors.', 'error', 'Validation Error');
        }
        return;
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Preferences validated. Redirecting...', 'success', 'Saved');
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 500);
    });
  }
}

function showDashFieldError(inputEl, msg) {
  inputEl.classList.add('is-invalid');
  const parent = inputEl.closest('.form-group, .soap-field-group');
  if (parent) {
    const errEl = parent.querySelector('.form-error-msg');
    if (errEl) errEl.textContent = msg;
  }
}

/* --------------------------------------------------------------------------
   Dashboard CTA Buttons -> Redirect to 404
   -------------------------------------------------------------------------- */
function initDashboardCTAButtons() {
  document.addEventListener('click', (e) => {
    // Target any button or link styled as a button in .dash-main, or action buttons
    const btn = e.target.closest('.dash-main button, .dash-main a.btn, .email-detail-footer button, .dash-table button');
    if (!btn) return;

    // Exclude navigation tabs, sidebar toggles, logouts, modal close buttons, and form submit buttons
    if (
      btn.hasAttribute('data-tab') ||
      btn.classList.contains('dash-sidebar-toggle') ||
      btn.classList.contains('action-logout') ||
      btn.hasAttribute('data-action') ||
      btn.hasAttribute('data-modal-close') ||
      btn.classList.contains('modal-close-btn') ||
      btn.type === 'submit' ||
      btn.closest('.dash-sidebar')
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    window.location.href = '404.html';
  });
}

/* --------------------------------------------------------------------------
   Email Center (Interactive Reader, Priority Filter, Search)
   -------------------------------------------------------------------------- */
const demoEmails = [
  {
    id: 1,
    sender: 'Sarah Miller (Owner of Cooper)',
    email: 'sarah.m@example.com',
    subject: 'Follow-up query regarding Cooper\'s post-dental care',
    date: 'Today, 10:45 AM',
    priority: 'Normal',
    unread: true,
    body: `Hello PawCare Team,\n\nCooper is resting comfortably after his ultrasonic dental cleaning yesterday. He ate a small portion of soft food this morning without hesitation. Just wondering if we should continue the oral rinse twice daily or only in the evening?\n\nThank you for taking such wonderful care of him!\n\nWarm regards,\nSarah Miller`
  },
  {
    id: 2,
    sender: 'Dr. Marcus Vance (Emergency Liaison)',
    email: 'm.vance@vetpartner-demo.org',
    subject: 'Referral Summary: Feline Asthma Case Transfer',
    date: 'Today, 09:15 AM',
    priority: 'High',
    unread: true,
    body: `Dear Dr. Jenkins & Clinical Staff,\n\nTransferred patient "Luna" (3yo DSH) presented last night with mild bronchospasm. Stabilized with humidified oxygen and low-dose dexamethasone. Chest radiographs attached in referral record demonstrate mild peribronchial cuffing. Recommended transfer to your outpatient service for long-term inhaler management.\n\nBest regards,\nDr. Marcus Vance`
  },
  {
    id: 3,
    sender: 'City Laboratory Diagnostics',
    email: 'results@cityvetlab-demo.com',
    subject: 'Complete Blood Count & Chemistry Panel: Bella (Canine)',
    date: 'Yesterday, 4:20 PM',
    priority: 'Normal',
    unread: false,
    body: `Patient: Bella (French Bulldog, 4yo)\nOwner: David Chen\nTest: Comprehensive Chemistry + CBC\n\nResults Summary:\nAll hepatic and renal parameters fall comfortably within reference intervals. Platelet count normal at 310 K/uL. No significant abnormal morphology observed. Full quantitative report filed in record PAW-4821.\n\nCity Vet Labs Automated Delivery`
  },
  {
    id: 4,
    sender: 'Vaccine Inventory Logistics',
    email: 'supply@vetmeddistributors-demo.com',
    subject: 'Shipment Notice: Feline Rabies & Canine DHPP Vials',
    date: 'Yesterday, 1:10 PM',
    priority: 'Normal',
    unread: false,
    body: `PawCare Clinic Operations,\n\nYour weekly replenishment of Core Canine DHPP (50 doses) and PureVax Rabies (30 doses) has arrived in cold-chain transit and is signed at reception.\n\nLot Numbers:\n- DHPP: #48102-EXP2028\n- Rabies: #99411-EXP2028\n\nCold-chain temperature monitor verified at 3.8°C.`
  }
];

function initEmailCenter() {
  const container = document.querySelector('.email-items-container');
  const detailPane = document.querySelector('.email-detail-pane');
  if (!container || !detailPane) return;

  function renderEmails(list) {
    container.innerHTML = '';
    list.forEach(email => {
      const item = document.createElement('div');
      item.className = `email-item ${email.unread ? 'unread' : ''}`;
      item.setAttribute('data-email-id', email.id);
      item.innerHTML = `
        <div class="email-item-header">
          <span class="email-item-sender">${email.sender}</span>
          <span class="email-item-date">${email.date}</span>
        </div>
        <div class="email-item-subject">${email.priority === 'High' ? '🔴 ' : ''}${email.subject}</div>
        <div class="email-item-preview">${email.body.replace(/\n/g, ' ')}</div>
      `;

      item.addEventListener('click', () => {
        container.querySelectorAll('.email-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        item.classList.remove('unread');
        email.unread = false;
        displayEmailDetail(email);
      });

      container.appendChild(item);
    });

    // Select first email by default
    if (list.length > 0) {
      const firstEl = container.querySelector('.email-item');
      if (firstEl) firstEl.click();
    }
  }

  function displayEmailDetail(email) {
    detailPane.innerHTML = `
      <div class="email-detail-header">
        <div>
          <h4 style="font-size: 1.2rem; margin-bottom: 0.35rem;">${email.subject}</h4>
          <p style="font-size: 0.85rem; color: var(--dash-muted); margin: 0;">
            From: <strong>${email.sender}</strong> &lt;${email.email}&gt;
          </p>
        </div>
        <div style="text-align: right;">
          <span class="status-badge ${email.priority === 'High' ? 'badge-urgent' : 'badge-completed'}">${email.priority} Priority</span>
          <div style="font-size: 0.775rem; color: var(--dash-muted); margin-top: 0.35rem;">${email.date}</div>
        </div>
      </div>
      <div class="email-detail-body">
        <p style="white-space: pre-line;">${email.body}</p>
      </div>
      <div class="email-detail-footer">
        <button type="button" class="btn btn-primary btn-sm btn-email-reply" onclick="window.location.href='404.html'">
          <i class="fa-solid fa-reply"></i> Reply
        </button>
        <button type="button" class="btn btn-outline btn-sm btn-email-archive" onclick="window.location.href='404.html'">
          <i class="fa-solid fa-box-archive"></i> Archive
        </button>
      </div>
    `;

    const replyBtn = detailPane.querySelector('.btn-email-reply');
    if (replyBtn) {
      replyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }

    const archiveBtn = detailPane.querySelector('.btn-email-archive');
    if (archiveBtn) {
      archiveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  }

  renderEmails(demoEmails);

  // Search input inside email center
  const emailSearchInput = document.getElementById('emailSearchInput');
  if (emailSearchInput) {
    emailSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = demoEmails.filter(m => 
        m.sender.toLowerCase().includes(query) || 
        m.subject.toLowerCase().includes(query) ||
        m.body.toLowerCase().includes(query)
      );
      renderEmails(filtered);
    });
  }
}

/* --------------------------------------------------------------------------
   Patient Record Inspection Modal
   -------------------------------------------------------------------------- */
function initPatientModalInspection() {
  const patientRows = document.querySelectorAll('.inspect-patient');
  const modal = document.getElementById('patientDetailModal');

  patientRows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // ignore action buttons
      if (!modal) return;

      const name = row.getAttribute('data-pet-name') || 'Patient Record';
      const species = row.getAttribute('data-pet-species') || 'Canine / Feline';
      const age = row.getAttribute('data-pet-age') || '3 Years';
      const owner = row.getAttribute('data-pet-owner') || 'Fictional Demo Owner';

      const modalTitle = modal.querySelector('.modal-pet-name');
      const modalMeta = modal.querySelector('.modal-pet-meta');
      if (modalTitle) modalTitle.textContent = name;
      if (modalMeta) modalMeta.textContent = `${species} • ${age} • Guardian: ${owner}`;

      modal.classList.add('open');
    });
  });
}

/* --------------------------------------------------------------------------
   Live Dashboard Search Filter for Tables
   -------------------------------------------------------------------------- */
function initDashboardSearch() {
  const searchInput = document.getElementById('dashGlobalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    const activePanel = document.querySelector('.dash-view-panel.active');
    if (!activePanel) return;

    const rows = activePanel.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(val) ? '' : 'none';
    });
  });
}
