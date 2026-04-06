/**
 * Aplicación Principal
 * Coordina todos los módulos y maneja la lógica principal
 */

import CustomModal from './modules/modals.js';
import FileManager from './modules/fileManager.js';
import TextEditor from './modules/editor.js';
import UIManager from './modules/ui.js';
import { logger } from './utils/logger.js';

class SimpleNotepadApp {
  constructor() {
    this.fileManager = new FileManager();
    this.textEditor = new TextEditor();
    this.uiManager = new UIManager();
    this.adManager = null; // Se inicializará después

    
    this.isInitialized = false;
  }

  // Inicializar la aplicación
  async init() {
    try {
      // Esperar a que el DOM esté completamente cargado
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Obtener elementos del DOM
      const editor = document.getElementById("editor");
      const filenameSpan = document.getElementById("filename");
      const charCount = document.getElementById("charCount");
      const wordCount = document.getElementById("wordCount");
      const lineCount = document.getElementById("lineCount");
      const statusInfo = document.getElementById("statusInfo");

      // Verificar elementos DOM esenciales
      if (!editor || !filenameSpan) {
        throw new Error('Elementos DOM críticos no encontrados');
      }

      // Inicializar módulos
      this.fileManager.initialize(editor, filenameSpan);
      this.textEditor.initialize(editor, charCount, wordCount, lineCount, statusInfo);
      this.uiManager.initialize();

      // Inicializar EmojiManager si está disponible
      if (typeof EmojiManager !== 'undefined') {
        this.emojiManager = new EmojiManager(editor);
      }

      // Inicializar AdManager si está disponible
      if (typeof AdManager !== 'undefined') {
        this.adManager = new AdManager();
        this.adManager.initialize();
      }
      
      // Conectar detección de cambios
      if (editor) {
        editor.addEventListener('input', () => {
          this.fileManager.onContentChange();
        });
      }

      // Configurar callbacks entre módulos
      this.setupCallbacks();

      // Configurar eventos adicionales
      this.setupAdditionalEvents();

      this.isInitialized = true;

      // Mostrar mensaje de bienvenida si es primera vez
      this.showWelcomeMessage();

    } catch (error) {
      logger.error('Error inicializando la aplicación:', error);
      CustomModal.error('Error al inicializar la aplicación. Por favor, recarga la página.', 'Error de Inicialización');
    }
  }

  // Configurar callbacks entre módulos
  setupCallbacks() {
    // Callbacks del editor
    this.textEditor.registerCallback('save', () => this.fileManager.saveFile());
    this.textEditor.registerCallback('saveAs', () => this.fileManager.saveAsFile());
    this.textEditor.registerCallback('open', () => this.fileManager.openFile());
    this.textEditor.registerCallback('new', () => this.fileManager.createNewFile());
    this.textEditor.registerCallback('rename', () => this.fileManager.renameFile());
    this.textEditor.registerCallback('find', () => this.textEditor.findText());
    this.textEditor.registerCallback('replace', () => this.textEditor.replaceText());
    this.textEditor.registerCallback('undo', () => this.textEditor.undo());
    this.textEditor.registerCallback('redo', () => this.textEditor.redo());
    this.textEditor.registerCallback('selectAll', () => this.textEditor.selectAll());
    this.textEditor.registerCallback('duplicate', () => this.textEditor.duplicateLine());
    this.textEditor.registerCallback('deleteLine', () => this.textEditor.deleteLine());
    this.textEditor.registerCallback('toggleComment', () => this.textEditor.toggleComment());

    // Callbacks del UI Manager
    this.uiManager.registerCallback('newFile', () => this.fileManager.createNewFile());
    this.uiManager.registerCallback('openFile', () => this.fileManager.openFile());
    this.uiManager.registerCallback('saveFile', () => this.fileManager.saveFile());
    this.uiManager.registerCallback('saveAsFile', () => this.fileManager.saveAsFile());
    this.uiManager.registerCallback('renameFile', () => this.fileManager.renameFile());

    // Botones de la barra secundaria
    this.setupSecondaryToolbar();

    // Drag & Drop
    this.setupDragAndDrop();

    // Panel de atajos
    this.setupShortcutsPanel();

    // Dark mode toggle en header
    this.setupDarkModeToggle();

    // Fullscreen button
    this.setupFullscreen();

    // Save indicator sync
    this.setupSaveIndicator();
  }

  // Configurar barra de herramientas secundaria
  setupSecondaryToolbar() {
    const buttons = {
      'undoBtn': () => this.textEditor.undo(),
      'redoBtn': () => this.textEditor.redo(),
      'findBtn': () => this.textEditor.findText(),
      'replaceBtn': () => this.textEditor.replaceText(),
      'duplicateBtn': () => this.textEditor.duplicateLine(),
      'deleteLineBtn': () => this.textEditor.deleteLine(),
      'commentBtn': () => this.textEditor.toggleComment(),
      'exportPdfBtn': () => this.exportToPDF(),
    };

    Object.entries(buttons).forEach(([id, handler]) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          handler();
        });
      }
    });
  }

  // Configurar Drag & Drop para abrir archivos
  setupDragAndDrop() {
    const editor = document.getElementById('editor');
    const dropZone = document.getElementById('dropZone');
    const editorContainer = document.querySelector('.editor');
    if (!editor || !editorContainer) return;

    let dragCounter = 0;

    editorContainer.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragCounter++;
      if (dropZone) dropZone.classList.remove('hidden');
    });

    editorContainer.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0 && dropZone) {
        dropZone.classList.add('hidden');
      }
    });

    editorContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    editorContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      dragCounter = 0;
      if (dropZone) dropZone.classList.add('hidden');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            editor.value = ev.target.result;
            this.fileManager.currentFilename = file.name;
            this.fileManager.lastSavedText = ev.target.result;
            if (this.fileManager.filenameSpan) {
              this.fileManager.filenameSpan.textContent = file.name;
            }
            this.fileManager.saveToLocalStorage();
            this.fileManager.updateSaveStatus();
            this.textEditor.updateStats();
            this.textEditor.updateStatus();
            CustomModal.toast(`Archivo "${file.name}" abierto correctamente`, 'success');
          };
          reader.readAsText(file);
        } else {
          CustomModal.alert('Solo se admiten archivos de texto (.txt)', 'Formato no soportado');
        }
      }
    });
  }

  // Panel de atajos de teclado
  setupShortcutsPanel() {
    const helpBtn = document.getElementById('shortcutsHelpBtn');
    const panel = document.getElementById('shortcutsPanel');
    const closeBtn = document.getElementById('closeShortcuts');

    if (!helpBtn || !panel) return;

    const togglePanel = () => {
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        panel.setAttribute('aria-hidden', 'false');
        if (closeBtn) closeBtn.focus();
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    };

    helpBtn.addEventListener('click', togglePanel);
    if (closeBtn) closeBtn.addEventListener('click', togglePanel);

    // Cerrar con Escape o clic fuera
    panel.addEventListener('click', (e) => {
      if (e.target === panel) togglePanel();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
        togglePanel();
      }
    });
  }

  // Dark mode toggle en header
  setupDarkModeToggle() {
    const btn = document.getElementById('darkModeToggle');
    if (!btn) return;

    // Verificar estado guardado o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determinar si debe estar en modo oscuro
    let isDark;
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      isDark = prefersDark;
    }

    // Aplicar estado inicial
    if (isDark) {
      document.body.classList.add('dark-mode');
      btn.textContent = '☀️';
      btn.title = 'Cambiar a modo claro';
    } else {
      document.body.classList.remove('dark-mode');
      btn.textContent = '🌙';
      btn.title = 'Cambiar a modo oscuro';
    }

    btn.addEventListener('click', () => {
      const nowDark = document.body.classList.toggle('dark-mode');
      btn.textContent = nowDark ? '☀️' : '🌙';
      btn.title = nowDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      localStorage.setItem('theme', nowDark ? 'dark' : 'light');

      // Animación de rotación
      btn.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 500);
    });
  }

  // Fullscreen toggle
  setupFullscreen() {
    const btn = document.getElementById('fullscreenBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btn.textContent = '⛶';
        btn.title = 'Salir de pantalla completa';
      } else {
        document.exitFullscreen();
        btn.textContent = '⛶';
        btn.title = 'Pantalla completa';
      }
    });

    document.addEventListener('fullscreenchange', () => {
      btn.textContent = document.fullscreenElement ? '⛶' : '⛶';
    });
  }

  // Sincronizar indicador de guardado en status bar
  setupSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    const editor = document.getElementById('editor');
    if (!indicator || !editor) return;

    const updateIndicator = () => {
      const hasChanges = this.fileManager.hasUnsavedChanges();
      if (hasChanges) {
        indicator.classList.remove('saved');
        indicator.classList.add('unsaved');
        indicator.title = 'Cambios sin guardar';
      } else {
        indicator.classList.remove('unsaved');
        indicator.classList.add('saved');
        indicator.title = 'Todos los cambios guardados';
      }
    };

    editor.addEventListener('input', updateIndicator);

    // Observar guardado del archivo (poll cada 2s)
    setInterval(updateIndicator, 2000);
  }

  // Configurar eventos adicionales
  setupAdditionalEvents() {
    // Prevenir pérdida de datos al cerrar
    window.addEventListener('beforeunload', (e) => {
      if (this.fileManager.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Manejar cambios en el tamaño de ventana
    const handleResize = this.uiManager.debounce(() => {
      // Actualizar estadísticas del editor
      this.textEditor.updateStats();
      this.textEditor.updateStatus();
    }, 300);
    
    window.addEventListener('resize', handleResize);

    // Manejar visibilidad de la página
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Guardar automáticamente cuando la página se oculta
        this.fileManager.saveToLocalStorage();
      }
    });

    // Auto-guardado periódico (cada 60 segundos como respaldo)
    setInterval(() => {
      if (this.fileManager.hasUnsavedChanges()) {
        this.fileManager.saveToLocalStorage();
      }
    }, 60000);
  }

  // Método público para actualizar estado (usado por EmojiManager)
  updateStatus() {
    if (this.textEditor) {
      this.textEditor.updateStats();
      this.textEditor.updateStatus();
    }
  }

  // Mostrar mensaje de bienvenida
  showWelcomeMessage() {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setTimeout(() => {
        CustomModal.alert(
          'Bienvenido a Simple Notepad. Usa Ctrl+S para guardar, Ctrl+O para abrir archivos, y explora el menú para más opciones.',
          'Bienvenido'
        ).then(() => {
          localStorage.setItem('hasVisited', 'true');
        });
      }, 2000);
    }
  }

  // Exportar a PDF usando la ventana de impresión del navegador
  async exportToPDF() {
    try {
      const content = this.textEditor.getContent();
      if (!content.trim()) {
        CustomModal.alert('No hay contenido para exportar.', 'Exportar PDF');
        return;
      }

      const filename = this.fileManager.getCurrentFilename().replace(/\.txt$/i, '');
      const safeContent = CustomModal.escapeHTML(content);

      // Abrir ventana de impresión con estilos optimizados para PDF
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        CustomModal.alert('El navegador bloqueó la ventana emergente. Permite las ventanas emergentes e intenta de nuevo.', 'Exportar PDF');
        return;
      }

      printWindow.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${CustomModal.escapeHTML(filename)}</title>
  <style>
    @media print {
      @page { margin: 2cm; size: A4; }
      body { margin: 0; }
    }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12pt;
      line-height: 1.6;
      color: #1e293b;
      background: #fff;
      padding: 2rem;
    }
    h1 {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 16pt;
      color: #334155;
      border-bottom: 2px solid #4a90e2;
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      font-size: 11pt;
      line-height: 1.5;
    }
    .footer {
      margin-top: 2rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e2e8f0;
      font-size: 9pt;
      color: #94a3b8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  </style>
</head>
<body>
  <h1>${CustomModal.escapeHTML(filename)}</h1>
  <pre>${safeContent}</pre>
  <div class="footer">Generado con Simple Notepad — ${new Date().toLocaleDateString('es-ES')}</div>
</body>
</html>`);
      printWindow.document.close();

      // Esperar a que cargue y lanzar impresión
      printWindow.addEventListener('afterprint', () => printWindow.close());
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);

      CustomModal.toast('Selecciona "Guardar como PDF" en el diálogo de impresión', 'info', 5000);
    } catch (error) {
      logger.error('Error exportando PDF:', error);
      CustomModal.error('Error al exportar a PDF', 'Error de Exportación');
    }
  }

  // Obtener información de la aplicación
  getAppInfo() {
    const stats = this.textEditor.getStats();
    return {
      filename: this.fileManager.getCurrentFilename(),
      hasUnsavedChanges: this.fileManager.hasUnsavedChanges(),
      stats: stats,
      isFileSystemSupported: this.fileManager.isFileSystemAccessSupported(),
      isInitialized: this.isInitialized
    };
  }

  // Actualizar interfaz de usuario
  updateUI() {
    // Actualizar contadores de texto
    if (this.textEditor) {
      this.textEditor.updateCounts();
    }

    // Actualizar estado de los botones si es necesario
    if (this.uiManager) {
      this.uiManager.updateButtonStates();
    }

    // Actualizar otros elementos de UI según sea necesario
    logger.log('🔄 UI updated');
  }



  // Método para debugging
  debug() {
    // Debug info solo disponible en desarrollo
    if (location.hostname === 'localhost' || location.protocol === 'file:') {
      logger.log('App Info:', this.getAppInfo());
      logger.log('File Manager:', this.fileManager);
      logger.log('Text Editor:', this.textEditor);
      logger.log('UI Manager:', this.uiManager);
      logger.log('Ad Manager:', this.adManager);
      if (this.adManager) {
        this.adManager.debug();
      }
    }
  }

  // Limpiar recursos
  destroy() {
    // Limpiar event listeners si es necesario
    // Guardar estado final
    this.fileManager.saveToLocalStorage();
  }
}

// Inicializar la aplicación cuando el script se carga
const app = new SimpleNotepadApp();

// Inicializar automáticamente
app.init();

// Exportar para uso global si es necesario
window.app = app;
window.SimpleNotepadApp = app;

// Exportar para módulos ES6
export default SimpleNotepadApp;