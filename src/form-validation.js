class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;

    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => { this.validateField(input) });
      input.addEventListener('input', () => { this.validateField(input) });
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateForm()) {
      console.log('Form is valid, submitting...');

      this.showSuccess();
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input, true)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(input, validateEmpty = false) {
    const value = input.value.trim();
    const fieldName = input.name;
    let isValid = true;
    let errorMessage = '';

    if (!value && this.form.classList.contains('modal__form') && !validateEmpty) {
      return true;
    }

    if (!value) {
      isValid = false;
      errorMessage = 'Це поле обов\'язкове';
    } else {
      switch (fieldName) {
        case 'name':
          const nameParts = value.trim().split(/\s+/);
          if (nameParts.length !== 2) {
            isValid = false;
            errorMessage = "Ім'я та прізвище повинні складатися з двох слів";
          } else if (!/^[a-zA-Z\u0400-\u04FF\s]+$/.test(value)) {
            isValid = false;
            errorMessage = "Ім'я може містити тільки літери";
          }
          break;

        case 'phone':
          const phoneRegex = /^\+380\d{9}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = "Номер телефону повинен бути у форматі +380XXXXXXXXX";
          }
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = "Введіть правильну адресу електронної пошти";
          }
          break;
      }
    }

    if (isValid) {
      this.clearError(input);
    } else {
      this.showError(input, errorMessage);
    }

    return isValid;
  }

  showError(input, message) {
    input.classList.add('error');

    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearError(input) {
    input.classList.remove('error');
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  clearAllValidation() {
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => {
      this.clearError(input);
      input.value = '';
    });

    if (this.form.parentNode) {
      const successMessages = this.form.parentNode.querySelectorAll('.success-message');
      successMessages.forEach(message => message.remove());
    }
  }

  showSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Дякую! Вашу заявку успішно відправлено.';

    const formFields = this.form.querySelector('.contacts__form__fields, .modal__form__fields');
    const submitButton = this.form.querySelector('.contacts__form__button, .modal__form__button');

    if (formFields && submitButton) {
      formFields.parentNode.insertBefore(successMessage, submitButton);
    } else {
      this.form.appendChild(successMessage);
    }

    this.form.reset();

    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('.contacts__form');
  new FormValidator('.modal__form');
});
