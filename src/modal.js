class Modal {
  constructor(modalId, triggerSelector) {
    this.modal = document.getElementById(modalId);
    this.trigger = document.querySelector(triggerSelector);
    this.closeBtn = document.getElementById('modal-close');
    this.overlay = document.getElementById('modal-overlay');
    this.formValidator = null;

    if (!this.modal || !this.trigger) return;

    this.init();
  }

  init() {
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
  }

  open() {
    this.modal.classList.add('modal--active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body--no-scroll');

    setTimeout(() => {
      const firstInput = this.modal.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  close() {
    this.modal.classList.remove('modal--active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body--no-scroll');

    this.clearFormValidation();

    if (this.trigger) {
      this.trigger.focus();
    }
  }

  clearFormValidation() {
    const modalForm = this.modal.querySelector('.modal__form');

    if (modalForm) {
      const inputs = modalForm.querySelectorAll('input');
      inputs.forEach(input => {
        input.classList.remove('error');
        input.value = '';

        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
          errorElement.remove();
        }
      });

      modalForm.reset();
    }

    const successMessages = this.modal.querySelectorAll('.success-message');
    successMessages.forEach(message => message.remove());
  }

  isOpen() {
    return this.modal.classList.contains('modal--active');
  }

  trapFocus(e) {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Modal('contact-modal', '.hero__action-button');
});
