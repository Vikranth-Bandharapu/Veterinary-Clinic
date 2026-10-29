/**
 * PawCare Veterinary Clinic - Form Validation
 * Contact Form & Appointment Inquiry Form
 *
 * Strict Requirement:
 * All forms MUST fully validate inputs first. If any field is empty or invalid,
 * inline error messages and toast warnings are shown, and submission/redirection is blocked.
 * Only after all required fields pass validation does the form display a success toast
 * and cleanly redirect to 404.html.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initAppointmentForm();
  initDatePickerRestrictions();
});

/* --------------------------------------------------------------------------
   Date Picker Restrictions (Prevent Past Dates)
   -------------------------------------------------------------------------- */
function initDatePickerRestrictions() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date();
  
  // Format as YYYY-MM-DD
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  dateInputs.forEach(input => {
    input.setAttribute('min', minDate);
  });
}

/* --------------------------------------------------------------------------
   Contact Form Validation & Redirection
   Validates all fields first; redirects to 404.html ONLY when valid.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.setAttribute('novalidate', 'true');

  const fullName = form.querySelector('[name="fullName"], #fullName');
  const email = form.querySelector('[name="email"], #email');
  const phone = form.querySelector('[name="phone"], #phone');
  const petName = form.querySelector('[name="petName"], #petName');
  const petType = form.querySelector('[name="petType"], #petType');
  const inquiryCategory = form.querySelector('[name="inquiryCategory"], #inquiryCategory');
  const message = form.querySelector('[name="message"], #message');

  // Real-time error removal on user input/change
  const fields = [fullName, email, phone, petName, petType, inquiryCategory, message].filter(Boolean);
  fields.forEach(field => {
    const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      clearFieldError(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidField = null;
    resetFormErrors(form);

    // 1. Full Name (At least 2 characters)
    if (!fullName || !fullName.value.trim() || fullName.value.trim().length < 2) {
      setFieldError(fullName, 'Please enter your full name (at least 2 characters).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = fullName;
    }

    // 2. Email Address
    const emailVal = email ? email.value.trim() : '';
    if (!emailVal) {
      setFieldError(email, 'Please enter your email address.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = email;
    } else if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
      setFieldError(email, 'Please enter a valid email address (e.g. name@domain.com).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = email;
    }

    // 3. Phone Number
    const phoneVal = phone ? phone.value.trim() : '';
    if (!phoneVal) {
      setFieldError(phone, 'Please enter your phone number.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phone;
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      setFieldError(phone, 'Please enter a valid phone number (at least 7 digits).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phone;
    }

    // 4. Pet Name
    if (!petName || !petName.value.trim()) {
      setFieldError(petName, 'Please enter your pet\'s name.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = petName;
    }

    // 5. Pet Species
    if (!petType || !petType.value) {
      setFieldError(petType, 'Please select your pet species.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = petType;
    }

    // 6. Inquiry Category
    if (!inquiryCategory || !inquiryCategory.value) {
      setFieldError(inquiryCategory, 'Please select an inquiry category.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = inquiryCategory;
    }

    // 7. Message (At least 10 characters)
    const msgVal = message ? message.value.trim() : '';
    if (!msgVal) {
      setFieldError(message, 'Please provide your inquiry message.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = message;
    } else if (msgVal.length < 10) {
      setFieldError(message, 'Please provide a little more detail (at least 10 characters).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = message;
    }

    // If invalid, focus first error and stop - DO NOT REDIRECT
    if (!isValid) {
      if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
        firstInvalidField.focus();
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Please correct the highlighted fields before submitting.', 'warning', 'Form Incomplete');
      }
      return;
    }

    // Form is completely valid -> Show success toast and redirect to 404.html
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    }

    if (typeof window.showToast === 'function') {
      window.showToast('Inquiry verified successfully! Redirecting...', 'success', 'Validated');
    }

    setTimeout(() => {
      window.location.href = '404.html';
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   Appointment Inquiry Form Validation & Redirection
   Validates all fields first; redirects to 404.html ONLY when valid.
   -------------------------------------------------------------------------- */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.setAttribute('novalidate', 'true');

  const ownerName = form.querySelector('[name="ownerName"], #ownerName');
  const email = form.querySelector('[name="email"], #appEmail');
  const phone = form.querySelector('[name="phone"], #appPhone');
  const petName = form.querySelector('[name="petName"], #appPetName');
  const petType = form.querySelector('[name="petType"], #appPetType');
  const petAge = form.querySelector('[name="petAge"], #petAge');
  const service = form.querySelector('[name="requestedService"], #requestedService');
  const dateInput = form.querySelector('[name="preferredDate"], #preferredDate');
  const timeInput = form.querySelector('[name="preferredTime"], #preferredTime');
  const notes = form.querySelector('[name="additionalNotes"], #additionalNotes');

  // Real-time error removal on user input/change
  const fields = [ownerName, email, phone, petName, petType, petAge, service, dateInput, timeInput].filter(Boolean);
  fields.forEach(field => {
    const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      clearFieldError(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidField = null;
    resetFormErrors(form);

    // 1. Owner Name (At least 2 characters)
    if (!ownerName || !ownerName.value.trim() || ownerName.value.trim().length < 2) {
      setFieldError(ownerName, 'Please provide the owner\'s full legal or preferred name.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = ownerName;
    }

    // 2. Email Address
    const emailVal = email ? email.value.trim() : '';
    if (!emailVal || !/^\S+@\S+\.\S+$/.test(emailVal)) {
      setFieldError(email, 'Please enter a valid confirmation email address.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = email;
    }

    // 3. Phone Number
    const phoneVal = phone ? phone.value.trim() : '';
    if (!phoneVal || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      setFieldError(phone, 'Please enter a valid phone number for SMS reminders.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = phone;
    }

    // 4. Pet Name
    if (!petName || !petName.value.trim()) {
      setFieldError(petName, 'Please enter your pet\'s name.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = petName;
    }

    // 5. Pet Species
    if (!petType || !petType.value) {
      setFieldError(petType, 'Please select your pet species.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = petType;
    }

    // 6. Pet Age
    if (!petAge || !petAge.value.trim()) {
      setFieldError(petAge, 'Please state your pet\'s approximate age (e.g. 2 years, 6 months).');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = petAge;
    }

    // 7. Service Requested
    if (!service || !service.value) {
      setFieldError(service, 'Please select the primary requested veterinary service.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = service;
    }

    // 8. Date (Past date validation check)
    if (!dateInput || !dateInput.value) {
      setFieldError(dateInput, 'Please select a preferred appointment date.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = dateInput;
    } else {
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setFieldError(dateInput, 'Appointment date cannot be in the past. Please select an upcoming date.');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = dateInput;
      }
    }

    // 9. Time Window
    if (!timeInput || !timeInput.value) {
      setFieldError(timeInput, 'Please choose a preferred consultation time window.');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = timeInput;
    }

    // If invalid, focus first error and stop - DO NOT REDIRECT
    if (!isValid) {
      if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
        firstInvalidField.focus();
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Please complete all required fields properly.', 'warning', 'Incomplete Inquiry');
      }
      return;
    }

    // Form is completely valid -> Show success toast and redirect to 404.html
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    }

    if (typeof window.showToast === 'function') {
      window.showToast('Appointment inquiry verified! Redirecting...', 'success', 'Validated');
    }

    setTimeout(() => {
      window.location.href = '404.html';
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   Helper Functions for Inline Error Management
   -------------------------------------------------------------------------- */
function setFieldError(field, msg) {
  if (!field) return;
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  const parent = field.parentElement;
  if (parent) {
    let err = parent.querySelector('.form-error-msg');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-error-msg';
      parent.appendChild(err);
    }
    err.textContent = msg;
  }
}

function clearFieldError(field) {
  if (!field) return;
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');
  const parent = field.parentElement;
  if (parent) {
    const err = parent.querySelector('.form-error-msg');
    if (err) err.textContent = '';
  }
}

function resetFormErrors(form) {
  if (!form) return;
  form.querySelectorAll('.is-invalid').forEach(f => {
    f.classList.remove('is-invalid');
    f.removeAttribute('aria-invalid');
  });
  form.querySelectorAll('.form-error-msg').forEach(e => {
    e.textContent = '';
  });
}
