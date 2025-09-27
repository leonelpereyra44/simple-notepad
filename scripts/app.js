/**
 * Aplicación Principal
 * Coordina todos los módulos y maneja la lógica principal
 */

import CustomModal from './modules/modals.js';
import FileManager from './modules/fileManager.js';
import TextEditor from './modules/editor.js';
import UIManager from './modules/ui.js';
// AdManager será cargado después de que el archivo se ejecute

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
      console.error('Error inicializando la aplicación:', error);
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

    // Auto-guardado periódico
    setInterval(() => {
      this.fileManager.saveToLocalStorage();
    }, 30000); // Cada 30 segundos
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

  // Exportar a PDF
  async exportToPDF() {
    try {
      const content = this.textEditor.getContent();
      if (!content.trim()) {
        CustomModal.alert('No hay contenido para exportar.', 'Exportar PDF');
        return;
      }

      // Usar html2pdf si está disponible
      if (typeof html2pdf !== 'undefined') {
        const element = document.createElement('div');
        element.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${content}</pre>`;
        
        const opt = {
          margin: 1,
          filename: this.fileManager.getCurrentFilename().replace('.txt', '.pdf'),
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
        CustomModal.toast('PDF exportado correctamente', 'success');
      } else {
        // Fallback: generar PDF simple
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileManager.getCurrentFilename().replace('.txt', '.pdf');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        CustomModal.toast('Archivo exportado (requiere conversión manual a PDF)', 'info');
      }
    } catch (error) {
      console.error('Error exportando PDF:', error);
      CustomModal.error('Error al exportar a PDF', 'Error de Exportación');
    }
  }

  // Exportar a Word
  async exportToWord() {
    try {
      const content = this.textEditor.getContent();
      if (!content.trim()) {
        CustomModal.alert('No hay contenido para exportar.', 'Exportar Word');
        return;
      }

      // Crear contenido HTML básico para Word
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${this.fileManager.getCurrentFilename()}</title>
        </head>
        <body>
          <pre style="font-family: 'Courier New', monospace; white-space: pre-wrap;">${content}</pre>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileManager.getCurrentFilename().replace('.txt', '.doc');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      CustomModal.toast('Documento Word exportado correctamente', 'success');
    } catch (error) {
      console.error('Error exportando Word:', error);
      CustomModal.error('Error al exportar a Word', 'Error de Exportación');
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
    console.log('🔄 UI updated');
  }



  // Método para debugging
  debug() {
    // Debug info solo disponible en desarrollo
    if (location.hostname === 'localhost' || location.protocol === 'file:') {
      console.log('App Info:', this.getAppInfo());
      console.log('File Manager:', this.fileManager);
      console.log('Text Editor:', this.textEditor);
      console.log('UI Manager:', this.uiManager);
      console.log('Ad Manager:', this.adManager);
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