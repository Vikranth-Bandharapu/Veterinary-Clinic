/**
 * PawCare Veterinary Clinic - Form Validation
 * Contact Form & Appointment Inquiry Form
 * Demonstrates accessible validation, past-date prevention & demo feedback.
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
   Contact Form Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="fullName"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const petName = form.querySelector('[name="petName"]');
    const petType = form.querySelector('[name="petType"]');
    const category = form.querySelector('[name="inquiryCategory"]');
    const message = form.querySelector('[name="message"]');

    let isValid = true;
    resetFormErrors(form);

    // Full name
    if (!name.value.trim() || name.value.trim().length < 2) {
      setFieldError(name, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // Email
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      setFieldError(email, 'Please provide a valid email address.');
      isValid = false;
    }

    // Phone
    const phoneVal = phone.value.trim();
    if (!phoneVal || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      setFieldError(phone, 'Please provide a valid contact phone number.');
      isValid = false;
    }

    // Pet Name
    if (!petName.value.trim()) {
      setFieldError(petName, 'Please enter your pet\'s name.');
      isValid = false;
    }

    // Pet Type
    if (!petType.value) {
      setFieldError(petType, 'Please select your pet species.');
      isValid = false;
    }

    // Category
    if (!category.value) {
      setFieldError(category, 'Please select an inquiry category.');
      isValid = false;
    }

    // Message
    if (!message.value.trim() || message.value.trim().length < 15) {
      setFieldError(message, 'Message must be at least 15 characters describing your question.');
      isValid = false;
    }

    if (!isValid) {
      window.showToast('Please correct the highlighted fields in the contact form.', 'error', 'Form Error');
      return;
    }

    // Show Demo Success State
    const successCard = document.getElementById('contactSuccessCard');
    if (successCard) {
      successCard.style.display = 'block';
      form.style.display = 'none';
      successCard.scrollIntoView({ behavior: 'smooth' });
    }

    window.showToast(
      'Demo inquiry submitted! No actual message dispatched as this is a simulation.',
      'success',
      'Inquiry Recorded'
    );
  });
}

/* --------------------------------------------------------------------------
   Appointment Inquiry Form Validation
   -------------------------------------------------------------------------- */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ownerName = form.querySelector('[name="ownerName"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const petName = form.querySelector('[name="petName"]');
    const petType = form.querySelector('[name="petType"]');
    const petAge = form.querySelector('[name="petAge"]');
    const service = form.querySelector('[name="requestedService"]');
    const dateInput = form.querySelector('[name="preferredDate"]');
    const timeInput = form.querySelector('[name="preferredTime"]');
    const notes = form.querySelector('[name="additionalNotes"]');

    let isValid = true;
    resetFormErrors(form);

    // Owner Name
    if (!ownerName.value.trim() || ownerName.value.trim().length < 2) {
      setFieldError(ownerName, 'Please provide the owner\'s full legal or preferred name.');
      isValid = false;
    }

    // Email
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      setFieldError(email, 'Please enter a valid confirmation email address.');
      isValid = false;
    }

    // Phone
    const phoneVal = phone.value.trim();
    if (!phoneVal || !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phoneVal)) {
      setFieldError(phone, 'Please enter a valid phone number for SMS reminders.');
      isValid = false;
    }

    // Pet Name
    if (!petName.value.trim()) {
      setFieldError(petName, 'Please enter your pet\'s name.');
      isValid = false;
    }

    // Pet Type
    if (!petType.value) {
      setFieldError(petType, 'Please select your pet species.');
      isValid = false;
    }

    // Pet Age
    if (!petAge.value.trim()) {
      setFieldError(petAge, 'Please state your pet\'s approximate age (e.g. 2 years, 6 months).');
      isValid = false;
    }

    // Service
    if (!service.value) {
      setFieldError(service, 'Please select the primary requested veterinary service.');
      isValid = false;
    }

    // Date (Past date validation check)
    if (!dateInput.value) {
      setFieldError(dateInput, 'Please select a preferred appointment date.');
      isValid = false;
    } else {
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setFieldError(dateInput, 'Appointment date cannot be in the past. Please select an upcoming date.');
        isValid = false;
      }
    }

    // Time
    if (!timeInput.value) {
      setFieldError(timeInput, 'Please choose a preferred consultation time window.');
      isValid = false;
    }

    if (!isValid) {
      window.showToast('Please complete all required fields properly.', 'error', 'Incomplete Inquiry');
      return;
    }

    // Generate Fictional Reference Code
    const refCode = 'PAW-' + Math.floor(100000 + Math.random() * 900000);

    // Populate Modal if present
    const modalRef = document.getElementById('modalRefCode');
    const modalPet = document.getElementById('modalPetSummary');
    const modalDate = document.getElementById('modalDateSummary');

    if (modalRef) modalRef.textContent = refCode;
    if (modalPet) modalPet.textContent = `${petName.value} (${petType.options[petType.selectedIndex].text})`;
    if (modalDate) modalDate.textContent = `${dateInput.value} at ${timeInput.options[timeInput.selectedIndex].text}`;

    const appointmentModal = document.getElementById('appointmentSuccessModal');
    if (appointmentModal) {
      appointmentModal.classList.add('open');
    }

    window.showToast(
      `Inquiry registered with demo reference ${refCode}. Note: This is a simulation.`,
      'success',
      'Inquiry Submitted'
    );

    form.reset();
  });
}

function setFieldError(field, msg) {
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  const err = field.parentElement.querySelector('.form-error-msg');
  if (err) err.textContent = msg;
}

function resetFormErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(f => {
    f.classList.remove('is-invalid');
    f.removeAttribute('aria-invalid');
  });
  form.querySelectorAll('.form-error-msg').forEach(e => {
    e.textContent = '';
  });
}
