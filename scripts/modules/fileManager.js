/**
 * Gestor de Archivos
 * Maneja la apertura, guardado y manipulación de archivos
 */

import CustomModal from './modals.js';

class FileManager {
  constructor() {
    this.currentFilename = 'sin_nombre.txt';
    this.lastSavedText = '';
    this.fileHandle = null; // File System Access API
    this.contentChangeCallback = null; // Callback para detectar cambios
  }

  // Inicializar el gestor con elementos DOM
  initialize(editor, filenameSpan) {
    this.editor = editor;
    this.filenameSpan = filenameSpan;
    
    // Cargar datos guardados
    this.loadFromLocalStorage();
  }

  // Cargar desde localStorage
  loadFromLocalStorage() {
    const savedText = localStorage.getItem("editorText");
    if (savedText !== null && this.editor) {
      this.editor.value = savedText;
      this.lastSavedText = savedText;
    }

    const savedFilename = localStorage.getItem("currentFilename");
    if (savedFilename) {
      this.currentFilename = savedFilename;
      if (this.filenameSpan) {
        this.filenameSpan.textContent = this.currentFilename;
      }
    }
  }

  // Guardar en localStorage
  saveToLocalStorage() {
    if (this.editor) {
      localStorage.setItem("editorText", this.editor.value);
    }
    localStorage.setItem("currentFilename", this.currentFilename);
  }

  // Registrar callback para cambios de contenido
  setContentChangeCallback(callback) {
    this.contentChangeCallback = callback;
  }

  // Detectar cambios en el contenido
  onContentChange() {
    this.updateSaveStatus();
    this.saveToLocalStorage();
    if (this.contentChangeCallback) {
      this.contentChangeCallback();
    }
  }

  // Actualizar estado de guardado visual
  updateSaveStatus() {
    if (!this.editor || !this.filenameSpan) return;
    
    const hasChanges = this.editor.value !== this.lastSavedText;
    const baseFilename = this.currentFilename.replace(/\*$/, '');
    
    if (hasChanges) {
      // Hay cambios no guardados
      this.currentFilename = baseFilename + '*';
      this.filenameSpan.title = '● Hay cambios no guardados';
      this.filenameSpan.classList.add('unsaved');
      
      // Actualizar título de la página
      document.title = `● ${baseFilename} - Simple Notepad`;
    } else {
      // Todo está guardado
      this.currentFilename = baseFilename;
      this.filenameSpan.title = '✓ Todos los cambios guardados';
      this.filenameSpan.classList.remove('unsaved');
      
      // Restaurar título de la página
      document.title = `${baseFilename} - Simple Notepad`;
    }
    
    this.filenameSpan.textContent = this.currentFilename;
    
    // Actualizar botones de guardado si existen
    this.updateSaveButtons(hasChanges);
  }

  // Actualizar estado visual de botones de guardado
  updateSaveButtons(hasChanges) {
    const saveButtons = [
      document.getElementById('saveBtnDesktop'),
      document.getElementById('menuSaveBtn')
    ];
    
    saveButtons.forEach(btn => {
      if (btn) {
        if (hasChanges) {
          btn.classList.add('primary', 'has-changes');
          btn.classList.remove('secondary');
          btn.title = '● Guardar cambios (Ctrl+S)';
        } else {
          btn.classList.remove('primary', 'has-changes');
          btn.classList.add('secondary');
          btn.title = 'Guardar (Ctrl+S)';
        }
      }
    });
  }

  // Verificar si File System Access API está disponible
  isFileSystemAccessSupported() {
    return 'showSaveFilePicker' in window;
  }

  // Guardar archivo
  async saveFile() {
    const text = this.editor ? this.editor.value : '';
    
    if (this.isFileSystemAccessSupported() && this.fileHandle) {
      try {
        const writable = await this.fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
        this.lastSavedText = text;
        this.updateSaveStatus();
        CustomModal.toast('Archivo guardado correctamente', 'success');
      } catch (err) {
        console.error(err);
        CustomModal.error('No se pudo guardar el archivo. Verifica los permisos o intenta nuevamente.', 'Error al Guardar');
      }
    } else {
      this.saveAsFile();
    }
  }

  // Guardar como nuevo archivo
  async saveAsFile() {
    const text = this.editor ? this.editor.value : '';
    
    if (this.isFileSystemAccessSupported()) {
      try {
        this.fileHandle = await window.showSaveFilePicker({
          suggestedName: this.currentFilename,
          types: [{
            description: 'Archivos de texto',
            accept: { 'text/plain': ['.txt'] }
          }]
        });
        
        const writable = await this.fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
        
        this.currentFilename = this.fileHandle.name;
        if (this.filenameSpan) {
          this.filenameSpan.textContent = this.currentFilename;
        }
        this.lastSavedText = text;
        this.updateSaveStatus();
        CustomModal.toast('Archivo guardado correctamente', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          CustomModal.error('No se pudo guardar el archivo.', 'Error al Guardar');
        }
      }
    } else {
      // Fallback para navegadores que no soportan File System Access API
      this.downloadFile(text, this.currentFilename);
    }
  }

  // Método fallback para descargar archivo
  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.lastSavedText = content;
    CustomModal.toast('Archivo descargado correctamente', 'success');
  }

  // Abrir archivo
  async openFile() {
    if (this.isFileSystemAccessSupported()) {
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [{
            description: 'Archivos de texto',
            accept: { 'text/plain': ['.txt'] }
          }]
        });
        
        const file = await fileHandle.getFile();
        const text = await file.text();
        
        if (this.editor) {
          this.editor.value = text;
        }
        
        this.fileHandle = fileHandle;
        this.currentFilename = file.name;
        if (this.filenameSpan) {
          this.filenameSpan.textContent = this.currentFilename;
        }
        this.lastSavedText = text;
        this.saveToLocalStorage();
        this.updateSaveStatus();
        
        CustomModal.toast(`Archivo "${file.name}" abierto correctamente`, 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          CustomModal.error('No se pudo abrir el archivo.', 'Error al Abrir');
        }
      }
    } else {
      // Fallback para navegadores que no soportan File System Access API
      this.openFileWithInput();
    }
  }

  // Método fallback para abrir archivo
  openFileWithInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,text/plain';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          if (this.editor) {
            this.editor.value = text;
          }
          
          this.currentFilename = file.name;
          if (this.filenameSpan) {
            this.filenameSpan.textContent = this.currentFilename;
          }
          this.lastSavedText = text;
          this.saveToLocalStorage();
          this.updateSaveStatus();
          
          CustomModal.toast(`Archivo "${file.name}" abierto correctamente`, 'success');
        };
        reader.readAsText(file);
      }
    });
    
    input.click();
  }

  // Crear nuevo archivo
  async createNewFile() {
    if (this.editor && this.editor.value) {
      const shouldCreate = await CustomModal.confirm(
        'Se perderán todos los cambios no guardados. ¿Estás seguro de que deseas crear un nuevo archivo?',
        'Crear Nuevo Archivo'
      );
      if (!shouldCreate) return;
    }
    
    if (this.editor) {
      this.editor.value = '';
    }
    this.currentFilename = 'sin_nombre.txt';
    this.fileHandle = null;
    if (this.filenameSpan) {
      this.filenameSpan.textContent = this.currentFilename;
    }
    
    this.lastSavedText = '';
    
    // Borrar datos guardados en localStorage
    localStorage.removeItem("editorText");
    localStorage.removeItem("currentFilename");
    
    this.updateSaveStatus();
    CustomModal.toast('Nuevo archivo creado', 'info');
  }

  // Renombrar archivo
  async renameFile() {
    const newName = await CustomModal.prompt(
      'Ingresa el nuevo nombre para el archivo:',
      this.currentFilename,
      'Renombrar Archivo'
    );
    
    if (!newName) return;
    
    this.currentFilename = newName.endsWith('.txt') ? newName : newName + '.txt';
    if (this.filenameSpan) {
      this.filenameSpan.textContent = this.currentFilename;
    }
    
    CustomModal.toast(`Archivo renombrado a: ${this.currentFilename}`, 'success');
  }

  // Verificar si hay cambios sin guardar
  hasUnsavedChanges() {
    if (!this.editor) return false;
    return this.editor.value !== this.lastSavedText;
  }

  // Getters
  getCurrentFilename() {
    return this.currentFilename;
  }

  getLastSavedText() {
    return this.lastSavedText;
  }

  getFileHandle() {
    return this.fileHandle;
  }
}

export default FileManager;