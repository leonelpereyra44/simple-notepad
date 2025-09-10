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
          alert('Archivo guardado correctamente.');
        } catch (err) {
          console.error(err);
          alert('No se pudo guardar el archivo.');
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
    newBtn.addEventListener('click', () => {
      if (editor.value && !confirm('Crear nuevo archivo y perder los cambios no guardados?')) return;
      editor.value = '';
      currentFilename = 'sin_nombre.txt';
      fileHandle = null;
      filenameSpan.textContent = currentFilename;
      lastSavedText = '';
      updateChars();
    });

    // Renombrar archivo (solo cambia el nombre mostrado, no el handle)
    renameBtn.addEventListener('click', () => {
      const newName = prompt('Nuevo nombre de archivo:', currentFilename);
      if (!newName) return;
      currentFilename = newName.endsWith('.txt') ? newName : newName + '.txt';
      filenameSpan.textContent = currentFilename;
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