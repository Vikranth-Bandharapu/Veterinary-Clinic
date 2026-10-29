/**
 * PawCare Veterinary Clinic - Authentication Handling
 * Demonstrates role-based routing (Clinic Admin & Veterinarian)
 * No plain-text passwords stored in localStorage/sessionStorage/URLs.
 */

function initAuth() {
  initLoginForm();
  initSignupForm();
  initLogoutButtons();
  checkRegisteredNotice();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

/* --------------------------------------------------------------------------
   Login Form Handler
   -------------------------------------------------------------------------- */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const roleSelect = document.getElementById('loginRole');

    let isValid = true;

    // Reset inline errors
    clearInlineErrors(loginForm);

    // Validate Email (Accept any email entered)
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setFieldError(emailInput, 'Please enter your email address.');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailVal) && !emailVal.includes('@')) {
      setFieldError(emailInput, 'Please enter a valid email address (e.g. name@domain.com).');
      isValid = false;
    }

    // Validate Password (Accept any password entered)
    if (!passwordInput.value) {
      setFieldError(passwordInput, 'Please enter your password.');
      isValid = false;
    }

    // Validate Role
    const role = roleSelect.value;
    if (!role || (role !== 'admin' && role !== 'vet')) {
      setFieldError(roleSelect, 'Please select your authorized role.');
      isValid = false;
    }

    if (!isValid) {
      if (typeof window.showToast === 'function') {
        window.showToast('Please correct the highlighted errors above.', 'error', 'Validation Error');
      }
      return;
    }

    // Store the exact entered email for display inside the dashboards
    try {
      localStorage.setItem('pawcare_logged_in_email', emailVal);
      sessionStorage.setItem('pawcare_logged_in_email', emailVal);
      localStorage.setItem('pawcare_user_role', role);
      sessionStorage.setItem('pawcare_user_role', role);
    } catch(err) {
      console.warn('Could not save login email:', err);
    }

    // Authentication Demo Routing (No passwords stored)
    if (role === 'admin') {
      if (typeof window.showToast === 'function') {
        window.showToast('Authentication verified. Launching Clinic Operations Dashboard...', 'success', 'Welcome, Admin');
      }
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 700);
    } else if (role === 'vet') {
      if (typeof window.showToast === 'function') {
        window.showToast('Clinical credentials verified. Launching Veterinary Workspace...', 'success', 'Welcome, Doctor');
      }
      setTimeout(() => {
        window.location.href = 'vet-dashboard.html';
      }, 700);
    }
  });
}

/* --------------------------------------------------------------------------
   Sign Up Form Handler
   Validates all fields and strictly redirects to login.html on success
   -------------------------------------------------------------------------- */
function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  const passwordInput = document.getElementById('signupPassword');
  const confirmInput = document.getElementById('signupConfirmPassword');

  // Real-time password requirement tracker
  if (passwordInput) {
    const handlePwdInput = () => validatePasswordRules(passwordInput.value);
    passwordInput.addEventListener('input', handlePwdInput);
    passwordInput.addEventListener('keyup', handlePwdInput);
    passwordInput.addEventListener('change', handlePwdInput);
  }

  // Auto-Fill Demo Button
  const autoFillBtn = document.getElementById('btnAutoFillSignup');
  if (autoFillBtn) {
    autoFillBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('signupName');
      const emailInput = document.getElementById('signupEmail');
      const phoneInput = document.getElementById('signupPhone');
      const roleSelect = document.getElementById('signupRole');

      if (nameInput) nameInput.value = 'Dr. Sarah Jenkins';
      if (emailInput) emailInput.value = 's.jenkins@pawcare-demo.org';
      if (phoneInput) phoneInput.value = '+1 (555) 019-2834';
      if (roleSelect) roleSelect.value = 'vet';
      if (passwordInput) passwordInput.value = 'PawCare2026!';
      if (confirmInput) confirmInput.value = 'PawCare2026!';

      validatePasswordRules('PawCare2026!');
      clearInlineErrors(signupForm);

      if (typeof window.showToast === 'function') {
        window.showToast('Demo credentials auto-filled. Click submit to test validation and login redirect.', 'info', 'Auto-Filled');
      }
    });
  }

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const phoneInput = document.getElementById('signupPhone');
    const roleSelect = document.getElementById('signupRole');

    let isValid = true;
    clearInlineErrors(signupForm);

    // Validate Full Name (min 3 chars)
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      setFieldError(nameInput, 'Full name must be at least 3 characters.');
      isValid = false;
    }

    // Validate Email format
    if (!emailInput.value.trim() || !/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'Please provide a valid work email.');
      isValid = false;
    }

    // Validate Phone format (digits, spaces, hyphens, plus, parenthesis - 7 to 15 digits)
    const phoneVal = phoneInput.value.trim();
    const phoneDigits = phoneVal.replace(/\D/g, '');
    if (!phoneVal || phoneDigits.length < 7 || phoneDigits.length > 15) {
      setFieldError(phoneInput, 'Please provide a valid contact phone number (e.g. +1 (555) 019-2834).');
      isValid = false;
    }

    // Strict Password Rules:
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const pass = passwordInput.value;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const hasLength = pass.length >= 8;

    if (!hasLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setFieldError(passwordInput, 'Password must be 8+ chars with uppercase, lowercase, number, and special symbol.');
      isValid = false;
    }

    // Confirm Password Matching
    if (confirmInput.value !== pass) {
      setFieldError(confirmInput, 'Passwords do not match. Please verify.');
      isValid = false;
    }

    // Role selection (strictly Clinic Admin or Veterinarian)
    const role = roleSelect.value;
    if (!role || (role !== 'admin' && role !== 'vet')) {
      setFieldError(roleSelect, 'Please select your authorized role (Clinic Admin or Veterinarian).');
      isValid = false;
    }

    if (!isValid) {
      if (typeof window.showToast === 'function') {
        window.showToast('Please correct the highlighted form errors.', 'error', 'Validation Notice');
      }
      return;
    }

    // Success State
    if (typeof window.showToast === 'function') {
      window.showToast(
        'Account created successfully in demonstration mode! Redirecting to login...',
        'success',
        'Registration Complete'
      );
    }

    // Clear sensitive input fields immediately
    passwordInput.value = '';
    confirmInput.value = '';

    // Prompt redirect to login page
    setTimeout(() => {
      window.location.href = 'login.html?registered=true';
    }, 700);
  });
}

function validatePasswordRules(pass) {
  const reqLen = document.getElementById('rule-length');
  const reqUpper = document.getElementById('rule-upper');
  const reqLower = document.getElementById('rule-lower');
  const reqNum = document.getElementById('rule-num');
  const reqSpecial = document.getElementById('rule-special');

  if (reqLen) reqLen.classList.toggle('met', pass.length >= 8);
  if (reqUpper) reqUpper.classList.toggle('met', /[A-Z]/.test(pass));
  if (reqLower) reqLower.classList.toggle('met', /[a-z]/.test(pass));
  if (reqNum) reqNum.classList.toggle('met', /[0-9]/.test(pass));
  if (reqSpecial) reqSpecial.classList.toggle('met', /[^A-Za-z0-9]/.test(pass));
}

/* --------------------------------------------------------------------------
   Registration Success Notice on Login Page
   -------------------------------------------------------------------------- */
function checkRegisteredNotice() {
  if (window.location.search && window.location.search.includes('registered=true')) {
    setTimeout(() => {
      if (typeof window.showToast === 'function') {
        window.showToast(
          'Your demo staff account is ready! Please sign in with your role to enter the portal.',
          'success',
          'Registration Verified'
        );
      }
    }, 250);
  }
}

/* --------------------------------------------------------------------------
   Logout Handler
   -------------------------------------------------------------------------- */
function initLogoutButtons() {
  const logoutButtons = document.querySelectorAll('.action-logout, [data-action="logout"]');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.showToast === 'function') {
        window.showToast('You have been logged out of your session.', 'info', 'Logged Out');
      }
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  });
}

/* --------------------------------------------------------------------------
   Helper Functions for Form Errors
   -------------------------------------------------------------------------- */
function setFieldError(inputEl, message) {
  inputEl.classList.add('is-invalid');
  inputEl.setAttribute('aria-invalid', 'true');
  const errorContainer = inputEl.parentElement.querySelector('.form-error-msg');
  if (errorContainer) {
    errorContainer.textContent = message;
  }
}

function clearInlineErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(el => {
    el.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
  });
  form.querySelectorAll('.form-error-msg').forEach(el => {
    el.textContent = '';
  });
}
