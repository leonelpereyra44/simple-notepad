/**
 * Sistema de Modales Personalizado
 * Maneja modales, alerts, confirms, prompts y notificaciones toast
 */

class CustomModal {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.isOpen = false;
  }

  createModal(type, title, message, buttons = []) {
    // Crear overlay si no existe
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-overlay';
      document.body.appendChild(this.overlay);
    }

    // Crear estructura del modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    
    // Iconos para cada tipo
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'i',
      confirm: '?'
    };

    this.modal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">
          <span class="modal-icon ${type}">${icons[type] || icons.info}</span>
          ${title}
        </h3>
      </div>
      <div class="modal-body">
        <p class="modal-message">${message}</p>
        ${type === 'prompt' ? '<input type="text" class="modal-input" placeholder="Ingrese el valor..." />' : ''}
      </div>
      <div class="modal-footer">
        ${buttons.map(btn => `
          <button class="modal-btn ${btn.class || ''}" data-action="${btn.action}">
            ${btn.text}
          </button>
        `).join('')}
      </div>
    `;

    this.overlay.innerHTML = '';
    this.overlay.appendChild(this.modal);

    return new Promise((resolve) => {
      // Configurar eventos de los botones
      this.modal.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-action');
          let result = action;
          
          // Si es un prompt, obtener el valor del input
          if (type === 'prompt' && action === 'ok') {
            const input = this.modal.querySelector('.modal-input');
            result = input.value;
          }
          
          this.close();
          resolve(result);
        });
      });

      // Cerrar con Escape
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          this.close();
          resolve(null);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Cerrar al hacer click en el overlay
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
          resolve(null);
        }
      });

      // Mostrar modal
      this.show();

      // Focus en el input si es prompt
      if (type === 'prompt') {
        setTimeout(() => {
          const input = this.modal.querySelector('.modal-input');
          if (input) input.focus();
        }, 100);
      }
    });
  }

  show() {
    this.isOpen = true;
    this.overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('show');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.modal = null;
    }, 300);
  }

  // Métodos públicos estilo alert/confirm/prompt
  static alert(message, title = 'Información') {
    const modal = new CustomModal();
    return modal.createModal('info', title, message, [
      { text: 'Aceptar', action: 'ok', class: 'primary' }
    ]);
  }

  static success(message, title = 'Éxito') {
    const modal = new CustomModal();
    return modal.createModal('success', title, message, [
      { text: 'Aceptar', action: 'ok', class: 'primary' }
    ]);
  }

  static error(message, title = 'Error') {
    const modal = new CustomModal();
    return modal.createModal('error', title, message, [
      { text: 'Aceptar', action: 'ok', class: 'primary' }
    ]);
  }

  // Notificaciones toast para feedback rápido
  static toast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'i'}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    // Contenedor de toasts
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    container.appendChild(toast);

    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Ocultar toast después del tiempo especificado
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);

    // Cerrar al hacer click
    toast.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
  }

  static confirm(message, title = 'Confirmación') {
    const modal = new CustomModal();
    return modal.createModal('confirm', title, message, [
      { text: 'Cancelar', action: 'cancel', class: '' },
      { text: 'Aceptar', action: 'ok', class: 'primary' }
    ]).then(result => result === 'ok');
  }

  static prompt(message, defaultValue = '', title = 'Ingrese un valor') {
    const modal = new CustomModal();
    const modalInstance = modal.createModal('prompt', title, message, [
      { text: 'Cancelar', action: 'cancel', class: '' },
      { text: 'Aceptar', action: 'ok', class: 'primary' }
    ]);
    
    // Establecer valor por defecto
    setTimeout(() => {
      const input = modal.modal.querySelector('.modal-input');
      if (input && defaultValue) {
        input.value = defaultValue;
        input.select();
      }
    }, 100);

    return modalInstance.then(result => {
      return result && result !== 'cancel' ? result : null;
    });
  }
}

// Exportar para uso en otros módulos
export default CustomModal;