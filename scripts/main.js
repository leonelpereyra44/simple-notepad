// Simple Notepad - Main Script

// === Sistema de Modales Personalizado ===
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

// Crear alias globales para compatibilidad
window.customAlert = CustomModal.alert;
window.customConfirm = CustomModal.confirm;
window.customPrompt = CustomModal.prompt;

// Elementos
    const editor = document.getElementById('editor');
    const saveBtn = document.getElementById('saveBtn');
    const openBtn = document.getElementById('openBtn');
    const newBtn = document.getElementById('newBtn');
    const renameBtn = document.getElementById('renameBtn');
    const saveAsBtn = document.getElementById('saveAsBtn');
    const filenameSpan = document.getElementById('filename');
    const charsSpan = document.getElementById('chars');

    // Estado
    let currentFilename = 'nombre.txt';
    let lastSavedText = '';
    let fileHandle = null; // File System Access API

    // Cargar desde localStorage al iniciar
    window.addEventListener("DOMContentLoaded", () => {
      const savedText = localStorage.getItem("editorText");
      if (savedText !== null) {
      editor.value = savedText;
      updateChars();
      lastSavedText = savedText;
      updateStatus();
      }

      const savedFilename = localStorage.getItem("currentFilename");
      if (savedFilename) {
        currentFilename = savedFilename;
        filenameSpan.textContent = currentFilename;
      }
    });

    // Guardar en localStorage cada vez que se escribe
  editor.addEventListener("input", () => {
    localStorage.setItem("editorText", editor.value);
    localStorage.setItem("currentFilename", currentFilename);
    updateChars();
    updateStatus();
  });

    // Contador de caracteres
    function updateChars() {
      charsSpan.textContent = editor.value.length;
    }

    editor.addEventListener('input', () => {
      updateChars();
    });

    // Guardar archivo
    async function saveFile() {
      const text = editor.value;

      if (fileHandle) {
        try {
          const writable = await fileHandle.createWritable();
          await writable.write(text);
          await writable.close();
          lastSavedText = text;
          updateStatus();
          CustomModal.toast('Archivo guardado correctamente', 'success');
        } catch (err) {
          console.error(err);
          CustomModal.error('No se pudo guardar el archivo. Verifica los permisos o intenta nuevamente.', 'Error al Guardar');
        }
      } else {
        saveAsFile();
      }
    }

    // Guardar como
    async function saveAsFile() {
      try {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: currentFilename,
          types: [
            { description: 'Text Files', accept: { 'text/plain': ['.txt'] } }
          ]
        });
        currentFilename = fileHandle.name;
        filenameSpan.textContent = currentFilename;
        await saveFile();
      } catch (err) {
        console.error(err);
      }
    }

    // Abrir archivo
    async function openFile() {
      try {
        [fileHandle] = await window.showOpenFilePicker({
          types: [
            { description: 'Text Files', accept: { 'text/plain': ['.txt'] } }
          ],
          multiple: false
        });

        const file = await fileHandle.getFile();
        editor.value = await file.text();
        currentFilename = file.name;
        filenameSpan.textContent = currentFilename;
        lastSavedText = editor.value;
        updateChars();
      } catch (err) {
        console.error(err);
      }
    }

    // Nuevo archivo
    newBtn.addEventListener('click', async () => {
      if (editor.value) {
        const shouldCreate = await CustomModal.confirm(
          'Se perderán todos los cambios no guardados. ¿Estás seguro de que deseas crear un nuevo archivo?',
          'Crear Nuevo Archivo'
        );
        if (!shouldCreate) return;
      }
      editor.value = '';
      currentFilename = 'sin_nombre.txt';
      fileHandle = null;
      CustomModal.toast('Nuevo archivo creado', 'info');
      filenameSpan.textContent = currentFilename;
      lastSavedText = '';
      updateChars();
      // Borrar datos guardados en localStorage
      localStorage.removeItem("editorText");
      localStorage.removeItem("currentFilename");
    });

    // Renombrar archivo (solo cambia el nombre mostrado, no el handle)
    renameBtn.addEventListener('click', async () => {
      const newName = await CustomModal.prompt(
        'Ingresa el nuevo nombre para el archivo:',
        currentFilename,
        'Renombrar Archivo'
      );
      if (!newName) return;
      currentFilename = newName.endsWith('.txt') ? newName : newName + '.txt';
      filenameSpan.textContent = currentFilename;
      CustomModal.toast(`Archivo renombrado a: ${currentFilename}`, 'success');
    });

    // Eventos botones
    openBtn.addEventListener('click', openFile);
    saveBtn.addEventListener('click', saveFile);
    saveAsBtn.addEventListener('click', saveAsFile);

    // Atajos de teclado
    window.addEventListener('keydown', (e) => {
      const cmd = e.ctrlKey || e.metaKey;
      if (!cmd) return;
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveFile();
      }
      if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        openFile();
      }
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        newBtn.click();
      }
    });

    // Estado de cambios
    function updateStatus() {
      const changed = editor.value !== lastSavedText;
      if (changed) {
        filenameSpan.title = 'Hay cambios no guardados';
      } else {
        filenameSpan.title = 'Todos los cambios guardados';
      }
      currentFilename = changed ? (currentFilename.endsWith('*') ? currentFilename : currentFilename + '*') : currentFilename.replace(/\*$/, '');
      filenameSpan.textContent = currentFilename;
      saveBtn.textContent = changed ? 'Guardar*' : 'Guardar';
      // Esta función actualiza el estado del archivo, incluyendo si hay cambios no guardados.
    }

    editor.addEventListener('input', updateStatus);
    updateChars();

    editor.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
      e.preventDefault(); // Evita que el foco cambie
      const start = this.selectionStart;
      const end = this.selectionEnd;

      // Inserta un tabulador (o 2-4 espacios si prefieres)
      const tabCharacter = "\t"; // o "    " para 4 espacios
      this.value = this.value.substring(0, start) + tabCharacter + this.value.substring(end);

      // Mueve el cursor después del tab
      this.selectionStart = this.selectionEnd = start + tabCharacter.length;
    }
  });

// Función para inicializar el menú hamburguesa
function initializeHamburgerMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    // Abrir/cerrar menú
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isVisible = menu.classList.contains("show");
      if (isVisible) {
        menu.classList.remove("show");
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add("show");
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Cerrar menú al hacer click en un botón dentro
    menu.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        menu.classList.remove("show");
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== menuToggle) {
        menu.classList.remove("show");
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Cerrar menú con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("show")) {
        menu.classList.remove("show");
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });

    // Inicializar aria-expanded
    menuToggle.setAttribute('aria-expanded', 'false');
  } else {
    console.error('No se pudieron encontrar los elementos del menú hamburguesa');
  }
}

// Llamar la función cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeHamburgerMenu();
    // Mensaje de bienvenida sutil
    setTimeout(() => {
      CustomModal.toast('¡Bienvenido al Bloc de Notas Online!', 'info', 2000);
    }, 1000);
  });
} else {
  initializeHamburgerMenu();
  // Mensaje de bienvenida sutil
  setTimeout(() => {
    CustomModal.toast('¡Bienvenido al Bloc de Notas Online!', 'info', 2000);
  }, 1000);
}


