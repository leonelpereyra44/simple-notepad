/**
 * Editor de Texto
 * Maneja la funcionalidad del editor de texto y estadísticas
 */

class TextEditor {
  constructor() {
    this.editor = null;
    this.charCount = null;
    this.wordCount = null;
    this.lineCount = null;
    this.statusInfo = null;
    
    // Configuración de atajos de teclado
    this.shortcuts = {
      'ctrl+s': 'save',
      'ctrl+shift+s': 'saveAs', 
      'ctrl+o': 'open',
      'ctrl+n': 'new',
      'ctrl+r': 'rename',
      'ctrl+f': 'find',
      'ctrl+shift+f': 'replace',
      'ctrl+z': 'undo',
      'ctrl+y': 'redo',
      'ctrl+a': 'selectAll',
      'ctrl+shift+d': 'duplicate',
      'ctrl+shift+k': 'deleteLine',
      'ctrl+/': 'toggleComment'
    };
    
    this.callbacks = {};
  }

  // Inicializar el editor
  initialize(editorElement, charCountElement, wordCountElement, lineCountElement, statusInfoElement) {
    this.editor = editorElement;
    this.charCount = charCountElement;
    this.wordCount = wordCountElement;
    this.lineCount = lineCountElement;
    this.statusInfo = statusInfoElement;
    
    console.log('📝 TextEditor inicializado:', { 
      editor: !!editorElement,
      charCount: !!charCountElement,
      wordCount: !!wordCountElement,
      lineCount: !!lineCountElement,
      statusInfo: !!statusInfoElement
    });
    
    if (this.editor) {
      this.setupEventListeners();
      this.updateStats();
      this.updateStatus();
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Actualizar estadísticas cuando el contenido cambie
    this.editor.addEventListener('input', () => {
      this.updateStats();
      this.updateStatus();
      this.saveToLocalStorage();
    });

    // Atajos de teclado
    this.editor.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Actualizar posición del cursor
    this.editor.addEventListener('selectionchange', () => {
      this.updateStatus();
    });

    this.editor.addEventListener('click', () => {
      this.updateStatus();
    });

    this.editor.addEventListener('keyup', () => {
      this.updateStatus();
    });
  }

  // Manejar atajos de teclado
  handleKeyboardShortcuts(e) {
    // Manejo especial para Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      this.insertTab(e.shiftKey);
      return;
    }

    const key = [];
    if (e.ctrlKey) key.push('ctrl');
    if (e.shiftKey) key.push('shift');
    if (e.altKey) key.push('alt');
    key.push(e.key.toLowerCase());
    
    const shortcut = key.join('+');
    const action = this.shortcuts[shortcut];
    
    if (action && this.callbacks[action]) {
      e.preventDefault();
      this.callbacks[action]();
    }
  }

  // Insertar tabulación o des-indentar
  insertTab(isShiftTab = false) {
    if (!this.editor) return;

    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const text = this.editor.value;
    const tabString = '    '; // 4 espacios

    if (start === end) {
      // No hay selección - insertar tab en la posición del cursor
      if (isShiftTab) {
        // Shift+Tab: remover indentación
        this.removeIndentation(start);
      } else {
        // Tab normal: insertar 4 espacios
        this.editor.value = text.substring(0, start) + tabString + text.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + tabString.length;
      }
    } else {
      // Hay selección - indentar/des-indentar líneas completas
      if (isShiftTab) {
        this.unindentSelectedLines(start, end);
      } else {
        this.indentSelectedLines(start, end);
      }
    }

    // Actualizar estadísticas después del cambio
    this.updateStats();
    this.updateStatus();
    
    // Trigger input event para que FileManager detecte cambios
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Indentar líneas seleccionadas
  indentSelectedLines(start, end) {
    const text = this.editor.value;
    const beforeSelection = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterSelection = text.substring(end);

    // Encontrar el inicio de la primera línea
    const lineStart = beforeSelection.lastIndexOf('\n') + 1;
    
    // Obtener todas las líneas en la selección
    const fullSelection = text.substring(lineStart, end);
    const lines = fullSelection.split('\n');
    
    // Indentar cada línea
    const indentedLines = lines.map(line => '    ' + line);
    const newText = beforeSelection.substring(0, lineStart) + indentedLines.join('\n') + afterSelection;
    
    this.editor.value = newText;
    
    // Actualizar selección
    const newStart = start + 4;
    const addedChars = indentedLines.length * 4;
    const newEnd = end + addedChars;
    
    this.editor.selectionStart = newStart;
    this.editor.selectionEnd = newEnd;
  }

  // Des-indentar líneas seleccionadas  
  unindentSelectedLines(start, end) {
    const text = this.editor.value;
    const beforeSelection = text.substring(0, start);
    const afterSelection = text.substring(end);

    // Encontrar el inicio de la primera línea
    const lineStart = beforeSelection.lastIndexOf('\n') + 1;
    
    // Obtener todas las líneas en la selección
    const fullSelection = text.substring(lineStart, end);
    const lines = fullSelection.split('\n');
    
    // Des-indentar cada línea (remover hasta 4 espacios del inicio)
    const unindentedLines = lines.map(line => {
      if (line.startsWith('    ')) {
        return line.substring(4);
      } else if (line.startsWith('   ')) {
        return line.substring(3);
      } else if (line.startsWith('  ')) {
        return line.substring(2);
      } else if (line.startsWith(' ')) {
        return line.substring(1);
      }
      return line;
    });
    
    const newText = beforeSelection.substring(0, lineStart) + unindentedLines.join('\n') + afterSelection;
    this.editor.value = newText;
    
    // Calcular nueva selección
    let removedChars = 0;
    lines.forEach(line => {
      if (line.startsWith('    ')) removedChars += 4;
      else if (line.startsWith('   ')) removedChars += 3;
      else if (line.startsWith('  ')) removedChars += 2;
      else if (line.startsWith(' ')) removedChars += 1;
    });
    
    const newStart = Math.max(lineStart, start - Math.min(4, start - lineStart));
    const newEnd = end - removedChars;
    
    this.editor.selectionStart = newStart;
    this.editor.selectionEnd = newEnd;
  }

  // Remover indentación en la posición actual del cursor
  removeIndentation(cursorPos) {
    const text = this.editor.value;
    const beforeCursor = text.substring(0, cursorPos);
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const currentLine = text.substring(lineStart, text.indexOf('\n', cursorPos));
    
    if (currentLine.startsWith('    ')) {
      // Remover 4 espacios
      this.editor.value = text.substring(0, lineStart) + text.substring(lineStart + 4);
      this.editor.selectionStart = this.editor.selectionEnd = cursorPos - 4;
    } else if (currentLine.startsWith('   ')) {
      // Remover 3 espacios
      this.editor.value = text.substring(0, lineStart) + text.substring(lineStart + 3);
      this.editor.selectionStart = this.editor.selectionEnd = cursorPos - 3;
    } else if (currentLine.startsWith('  ')) {
      // Remover 2 espacios
      this.editor.value = text.substring(0, lineStart) + text.substring(lineStart + 2);
      this.editor.selectionStart = this.editor.selectionEnd = cursorPos - 2;
    } else if (currentLine.startsWith(' ')) {
      // Remover 1 espacio
      this.editor.value = text.substring(0, lineStart) + text.substring(lineStart + 1);
      this.editor.selectionStart = this.editor.selectionEnd = cursorPos - 1;
    }
  }

  // Registrar callbacks para acciones
  registerCallback(action, callback) {
    this.callbacks[action] = callback;
  }

  // Actualizar estadísticas
  updateStats() {
    if (!this.editor) return;
    
    const text = this.editor.value;
    
    // Contar caracteres
    const chars = text.length;
    if (this.charCount) {
      this.charCount.textContent = chars.toLocaleString();
    }
    
    // Contar palabras (opcional si existe el elemento)
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    if (this.wordCount) {
      this.wordCount.textContent = words.toLocaleString();
    }
    
    // Contar líneas (opcional si existe el elemento)
    const lines = text === '' ? 1 : text.split('\n').length;
    if (this.lineCount) {
      this.lineCount.textContent = lines.toLocaleString();
    }
  }

  // Actualizar información de estado
  updateStatus() {
    if (!this.editor || !this.statusInfo) return;
    
    const cursorPosition = this.editor.selectionStart;
    const text = this.editor.value;
    
    // Calcular línea y columna
    const textBeforeCursor = text.substring(0, cursorPosition);
    const line = textBeforeCursor.split('\n').length;
    const column = textBeforeCursor.split('\n').pop().length + 1;
    
    // Información de selección
    const selectionLength = this.editor.selectionEnd - this.editor.selectionStart;
    let statusText = `Línea ${line}, Columna ${column}`;
    
    if (selectionLength > 0) {
      statusText += ` | ${selectionLength} caracteres seleccionados`;
    }
    
    this.statusInfo.textContent = statusText;
  }

  // Funciones de edición
  insertText(text) {
    if (!this.editor) return;
    
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const currentText = this.editor.value;
    
    const newText = currentText.substring(0, start) + text + currentText.substring(end);
    this.editor.value = newText;
    
    // Mantener el cursor después del texto insertado
    const newCursorPosition = start + text.length;
    this.editor.setSelectionRange(newCursorPosition, newCursorPosition);
    
    this.updateStats();
    this.updateStatus();
    this.editor.focus();
  }

  // Duplicar línea actual
  duplicateLine() {
    if (!this.editor) return;
    
    const cursorPosition = this.editor.selectionStart;
    const text = this.editor.value;
    const lines = text.split('\n');
    const textBeforeCursor = text.substring(0, cursorPosition);
    const currentLineIndex = textBeforeCursor.split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    lines.splice(currentLineIndex + 1, 0, currentLine);
    this.editor.value = lines.join('\n');
    
    // Posicionar cursor en la línea duplicada
    const newCursorPosition = cursorPosition + currentLine.length + 1;
    this.editor.setSelectionRange(newCursorPosition, newCursorPosition);
    
    this.updateStats();
    this.updateStatus();
  }

  // Eliminar línea actual
  deleteLine() {
    if (!this.editor) return;
    
    const cursorPosition = this.editor.selectionStart;
    const text = this.editor.value;
    const lines = text.split('\n');
    const textBeforeCursor = text.substring(0, cursorPosition);
    const currentLineIndex = textBeforeCursor.split('\n').length - 1;
    
    if (lines.length > 1) {
      lines.splice(currentLineIndex, 1);
      this.editor.value = lines.join('\n');
      
      // Ajustar posición del cursor
      const lineStart = text.lastIndexOf('\n', cursorPosition - 1) + 1;
      const newCursorPosition = Math.min(lineStart, this.editor.value.length);
      this.editor.setSelectionRange(newCursorPosition, newCursorPosition);
    } else {
      this.editor.value = '';
      this.editor.setSelectionRange(0, 0);
    }
    
    this.updateStats();
    this.updateStatus();
  }

  // Comentar/descomentar línea
  toggleComment() {
    if (!this.editor) return;
    
    const cursorPosition = this.editor.selectionStart;
    const text = this.editor.value;
    const lines = text.split('\n');
    const textBeforeCursor = text.substring(0, cursorPosition);
    const currentLineIndex = textBeforeCursor.split('\n').length - 1;
    const currentLine = lines[currentLineIndex];
    
    if (currentLine.trim().startsWith('//')) {
      // Descomentar
      lines[currentLineIndex] = currentLine.replace(/^(\s*)\/\/\s?/, '$1');
    } else {
      // Comentar
      const leadingSpaces = currentLine.match(/^(\s*)/)[1];
      lines[currentLineIndex] = leadingSpaces + '// ' + currentLine.trim();
    }
    
    this.editor.value = lines.join('\n');
    
    // Mantener posición del cursor
    const newText = this.editor.value;
    const newCursorPosition = Math.min(cursorPosition, newText.length);
    this.editor.setSelectionRange(newCursorPosition, newCursorPosition);
    
    this.updateStats();
    this.updateStatus();
  }

  // Buscar texto
  findText() {
    if (!this.editor) return;
    
    const searchTerm = prompt('Buscar:');
    if (!searchTerm) return;
    
    const text = this.editor.value;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index !== -1) {
      this.editor.focus();
      this.editor.setSelectionRange(index, index + searchTerm.length);
    } else {
      alert('Texto no encontrado');
    }
  }

  // Reemplazar texto
  replaceText() {
    if (!this.editor) return;
    
    const searchTerm = prompt('Buscar:');
    if (!searchTerm) return;
    
    const replaceTerm = prompt('Reemplazar con:');
    if (replaceTerm === null) return;
    
    const text = this.editor.value;
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const newText = text.replace(regex, replaceTerm);
    
    this.editor.value = newText;
    this.updateStats();
    this.updateStatus();
  }

  // Deshacer/rehacer (básico)
  undo() {
    document.execCommand('undo');
    this.updateStats();
    this.updateStatus();
  }

  redo() {
    document.execCommand('redo');
    this.updateStats();
    this.updateStatus();
  }

  // Seleccionar todo
  selectAll() {
    if (!this.editor) return;
    this.editor.select();
    this.updateStatus();
  }

  // Guardar en localStorage
  saveToLocalStorage() {
    if (!this.editor) return;
    localStorage.setItem("editorText", this.editor.value);
  }

  // Obtener contenido del editor
  getContent() {
    return this.editor ? this.editor.value : '';
  }

  // Establecer contenido del editor
  setContent(content) {
    if (!this.editor) return;
    this.editor.value = content;
    this.updateStats();
    this.updateStatus();
  }

  // Enfocar el editor
  focus() {
    if (this.editor) {
      this.editor.focus();
    }
  }

  // Obtener estadísticas
  getStats() {
    if (!this.editor) return { chars: 0, words: 0, lines: 0 };
    
    const text = this.editor.value;
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines = text === '' ? 1 : text.split('\n').length;
    
    return { chars, words, lines };
  }
}

export default TextEditor;