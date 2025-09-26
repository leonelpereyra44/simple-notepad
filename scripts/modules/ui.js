/**
 * Gestor de Interfaz de Usuario
 * Maneja la interacción con elementos de la interfaz
 */

class UIManager {
  constructor() {
    this.hamburgerBtn = null;
    this.menu = null;
    this.menuItems = null;
    this.isMenuOpen = false;
    this.callbacks = {};
  }

  // Inicializar el gestor de UI
  initialize() {
    this.setupMenuItems();
    this.setupActionsMenu();
    this.setupThemeToggle();
  }

  // Configurar menú hamburguesa
  setupHamburgerMenu() {
    this.hamburgerBtn = document.getElementById('menuToggle');
    this.menu = document.getElementById('menu');
    
    if (this.hamburgerBtn && this.menu) {
      this.hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }
  }

  // Configurar elementos del menú
  setupMenuItems() {
    // Configurar botones desktop
    const desktopButtons = [
      { id: 'newBtnDesktop', action: 'newFile' },
      { id: 'openBtnDesktop', action: 'openFile' },
      { id: 'saveBtnDesktop', action: 'saveFile' },
      { id: 'saveAsBtnDesktop', action: 'saveAsFile' },
      { id: 'renameBtn', action: 'renameFile' }
    ];

    desktopButtons.forEach(({ id, action }) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleMenuAction(action);
        });
      }
    });

    // Configurar botones del menú móvil
    const mobileButtons = [
      { id: 'menuNewBtn', action: 'newFile' },
      { id: 'menuOpenBtn', action: 'openFile' },
      { id: 'menuSaveBtn', action: 'saveFile' },
      { id: 'menuSaveAsBtn', action: 'saveAsFile' }
    ];

    mobileButtons.forEach(({ id, action }) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.hideActionsMenu();
          this.handleMenuAction(action);
        });
      }
    });
  }

  // Manejar acciones del menú
  handleMenuAction(action) {
    this.closeMenu();
    
    if (this.callbacks[action]) {
      this.callbacks[action]();
    }
  }

  // Registrar callback para acción
  registerCallback(action, callback) {
    this.callbacks[action] = callback;
  }

  // Toggle del menú
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  // Abrir menú
  openMenu() {
    if (this.menu && this.hamburgerBtn) {
      this.menu.classList.add('show');
      this.hamburgerBtn.classList.add('active');
      this.isMenuOpen = true;

    }
  }

  // Cerrar menú
  closeMenu() {
    if (this.menu && this.hamburgerBtn) {
      this.menu.classList.remove('show');
      this.hamburgerBtn.classList.remove('active');
      this.isMenuOpen = false;

    }
  }

  // Configurar click fuera del menú para cerrarlo
  setupClickOutside() {
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && this.menu && !this.menu.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  // Configurar toggle de tema oscuro
  setupThemeToggle() {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.updateThemeToggle(true);
    }
  }

  // Toggle del modo oscuro
  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    this.updateThemeToggle(isDark);
    
    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Actualizar texto del toggle de tema
  updateThemeToggle(isDark) {
    const darkModeElement = this.menuItems.darkMode;
    if (darkModeElement) {
      darkModeElement.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    }
  }

  // Toggle de pantalla completa
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Mostrar/ocultar elementos de la UI
  showElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'block';
      element.classList.remove('hidden');
    }
  }

  hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'none';
      element.classList.add('hidden');
    }
  }

  // Actualizar texto de un elemento
  updateText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  // Actualizar valor de un elemento
  updateValue(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.value = value;
    }
  }

  // Añadir clase a un elemento
  addClass(selector, className) {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add(className);
    }
  }

  // Remover clase de un elemento
  removeClass(selector, className) {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove(className);
    }
  }

  // Toggle de clase en un elemento
  toggleClass(selector, className) {
    const element = document.querySelector(selector);
    if (element) {
      return element.classList.toggle(className);
    }
    return false;
  }

  // Configurar loading state
  showLoading(message = 'Cargando...') {
    // Crear o mostrar elemento de loading
    let loader = document.querySelector('.app-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'app-loader';
      loader.innerHTML = `
        <div class="loader-content">
          <div class="spinner"></div>
          <span class="loader-message">${message}</span>
        </div>
      `;
      document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
    loader.querySelector('.loader-message').textContent = message;
  }

  hideLoading() {
    const loader = document.querySelector('.app-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  // Configurar focus trap para accesibilidad
  setupFocusTrap(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
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
    });

    // Enfocar el primer elemento
    firstElement.focus();
  }

  // Utilidad para debounce de eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Utilidad para throttle de eventos
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Obtener dimensiones de la ventana
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  // Verificar si es dispositivo móvil
  isMobile() {
    return window.innerWidth <= 768;
  }

  // Verificar si es dispositivo táctil
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // Configurar menú de 3 puntos para móvil
  setupActionsMenu() {
    const toggleBtn = document.querySelector('.actions-menu-toggle');
    const menu = document.querySelector('.actions-menu');
    
    if (!toggleBtn || !menu) {
      return;
    }
    
    // Toggle del menú
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menu.classList.remove('show');
      }
    });

  }

  // Ocultar menú de acciones
  hideActionsMenu() {
    const menu = document.querySelector('.actions-menu');
    if (menu) {
      menu.classList.remove('show');
    }
  }
}

export default UIManager;