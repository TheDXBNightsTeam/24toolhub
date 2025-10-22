/**
 * Native Popup System for 24ToolHub
 * A lightweight, accessible popup system with smooth animations
 */

class NativePopup {
  constructor() {
    this.overlay = null;
    this.container = null;
    this.isOpen = false;
    this.onCloseCallback = null;
    this.onConfirmCallback = null;
    this.init();
  }

  init() {
    this.createPopupHTML();
    this.bindEvents();
  }

  createPopupHTML() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'popup-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');

    // Create container
    this.container = document.createElement('div');
    this.container.className = 'popup-container';

    // Create header
    const header = document.createElement('div');
    header.className = 'popup-header';
    
    const title = document.createElement('h2');
    title.className = 'popup-title';
    title.id = 'popup-title';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close popup');
    closeBtn.onclick = () => this.close();
    
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create content
    const content = document.createElement('div');
    content.className = 'popup-content';
    content.id = 'popup-content';

    // Create footer
    const footer = document.createElement('div');
    footer.className = 'popup-footer';
    footer.id = 'popup-footer';

    // Assemble popup
    this.container.appendChild(header);
    this.container.appendChild(content);
    this.container.appendChild(footer);
    this.overlay.appendChild(this.container);

    // Add to body
    document.body.appendChild(this.overlay);
  }

  bindEvents() {
    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Trap focus within popup
    this.overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.isOpen) {
        this.trapFocus(e);
      }
    });
  }

  trapFocus(e) {
    const focusableElements = this.container.querySelectorAll(
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

  show(options = {}) {
    const {
      title = 'Popup',
      content = '',
      type = 'info', // info, warning, error, success, confirm
      buttons = [],
      onClose = null,
      onConfirm = null,
      width = '500px',
      height = 'auto'
    } = options;

    // Set callbacks
    this.onCloseCallback = onClose;
    this.onConfirmCallback = onConfirm;

    // Set title
    const titleElement = document.getElementById('popup-title');
    titleElement.textContent = title;

    // Set content
    const contentElement = document.getElementById('popup-content');
    if (typeof content === 'string') {
      contentElement.innerHTML = content;
    } else {
      contentElement.innerHTML = '';
      contentElement.appendChild(content);
    }

    // Set container size
    this.container.style.width = width;
    this.container.style.height = height;

    // Create buttons
    this.createButtons(buttons, type);

    // Show popup
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    this.isOpen = true;

    // Focus first focusable element
    setTimeout(() => {
      const firstFocusable = this.container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  createButtons(buttons, type) {
    const footer = document.getElementById('popup-footer');
    footer.innerHTML = '';

    if (buttons.length === 0) {
      // Default buttons based on type
      if (type === 'confirm') {
        buttons.push(
          { text: 'Cancel', type: 'secondary', action: 'close' },
          { text: 'Confirm', type: 'primary', action: 'confirm' }
        );
      } else {
        buttons.push({ text: 'OK', type: 'primary', action: 'close' });
      }
    }

    buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.className = `popup-btn popup-btn-${button.type || 'primary'}`;
      btn.textContent = button.text;
      btn.onclick = () => this.handleButtonClick(button.action);
      footer.appendChild(btn);
    });
  }

  handleButtonClick(action) {
    switch (action) {
      case 'close':
        this.close();
        break;
      case 'confirm':
        if (this.onConfirmCallback) {
          this.onConfirmCallback();
        }
        this.close();
        break;
      default:
        if (typeof action === 'function') {
          action();
        }
        break;
    }
  }

  close() {
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.isOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';

    // Call onClose callback
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }

    // Clear callbacks
    this.onCloseCallback = null;
    this.onConfirmCallback = null;
  }

  // Convenience methods
  alert(message, title = 'Alert') {
    this.show({
      title,
      content: `<p>${message}</p>`,
      type: 'info'
    });
  }

  confirm(message, title = 'Confirm', onConfirm = null) {
    this.show({
      title,
      content: `<p>${message}</p>`,
      type: 'confirm',
      onConfirm
    });
  }

  prompt(message, defaultValue = '', title = 'Input', onConfirm = null) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultValue;
    input.className = 'form-input';
    input.style.width = '100%';
    input.style.marginTop = '1rem';

    const content = document.createElement('div');
    content.innerHTML = `<p>${message}</p>`;
    content.appendChild(input);

    this.show({
      title,
      content,
      type: 'confirm',
      onConfirm: () => {
        if (onConfirm) {
          onConfirm(input.value);
        }
      }
    });

    // Focus input
    setTimeout(() => input.focus(), 100);
  }

  success(message, title = 'Success') {
    this.show({
      title,
      content: `<div style="color: #10b981; text-align: center; padding: 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
        <p>${message}</p>
      </div>`,
      type: 'success'
    });
  }

  error(message, title = 'Error') {
    this.show({
      title,
      content: `<div style="color: #ef4444; text-align: center; padding: 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✗</div>
        <p>${message}</p>
      </div>`,
      type: 'error'
    });
  }

  warning(message, title = 'Warning') {
    this.show({
      title,
      content: `<div style="color: #f59e0b; text-align: center; padding: 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠</div>
        <p>${message}</p>
      </div>`,
      type: 'warning'
    });
  }

  loading(message = 'Loading...', title = 'Please Wait') {
    this.show({
      title,
      content: `<div style="text-align: center; padding: 2rem;">
        <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p>${message}</p>
      </div>`,
      type: 'info',
      buttons: []
    });
  }

  custom(options) {
    this.show(options);
  }
}

// Add spin animation for loading
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Create global instance
window.popup = new NativePopup();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NativePopup;
}
