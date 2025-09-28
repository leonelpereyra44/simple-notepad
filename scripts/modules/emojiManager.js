/**
 * EmojiManager - Gestor del panel de emojis
 * Permite insertar emojis en el editor de texto
 */

class EmojiManager {
  constructor(editor) {
    this.editor = editor;
    this.panel = document.getElementById('emojiPanel');
    this.btn = document.getElementById('emojiBtn');
    this.grid = document.getElementById('emojiGrid');
    this.closeBtn = document.getElementById('emojiCloseBtn');
    this.categoryBtns = document.querySelectorAll('.emoji-category-btn');
    this.currentCategory = 'recent';
    
    // Categorías de emojis
    this.categories = {
      recent: this.getRecentEmojis(),
      smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'],
      work: ['📝', '📊', '📈', '📉', '💼', '🎯', '⚠️', '✅', '❌', '📋', '📌', '📍', '🔍', '💡', '🔥', '⭐', '🚀', '📱', '💻', '🌍', '🔧', '⚙️', '📧', '📞', '💰', '📅', '⏰', '⏱️', '⏲️', '🔔', '🔕', '📢'],
      symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '🔄', '🔃', '🔂', '▶️']
    };
    
    this.init();
  }

  init() {
    if (!this.panel || !this.btn || !this.editor) return;
    
    // Event listeners
    this.btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePanel();
    });
    
    this.closeBtn.addEventListener('click', () => {
      this.hidePanel();
    });
    
    // Event listener para categorías
    this.categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchCategory(btn.dataset.category);
        this.updateActiveCategory(btn);
      });
    });
    
    // Cerrar panel al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.panel.contains(e.target) && e.target !== this.btn) {
        this.hidePanel();
      }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.panel.classList.contains('hidden')) {
        this.hidePanel();
      }
    });
    
    // Reposicionar panel al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
      if (!this.panel.classList.contains('hidden')) {
        // Pequeño delay para que se aplique el CSS responsive
        setTimeout(() => {
          this.showPanel();
        }, 100);
      }
    });
    
    // Cargar emojis de la categoría inicial
    this.loadEmojis('recent');
    
    console.log('EmojiManager inicializado');
  }

  togglePanel() {
    if (this.panel.classList.contains('hidden')) {
      this.showPanel();
    } else {
      this.hidePanel();
    }
  }

  showPanel() {
    this.panel.classList.remove('hidden');
    
    // En móviles, usar posición fija centrada
    if (window.innerWidth <= 480) {
      this.panel.style.top = '70px';
      this.panel.style.left = '10px';
      this.panel.style.transform = 'none';
      return;
    }
    
    // En desktop, posicionar cerca del botón
    const btnRect = this.btn.getBoundingClientRect();
    
    // Calcular posición óptima
    let top = btnRect.bottom + 8;
    let left = btnRect.left;
    
    // Obtener dimensiones del panel después de mostrarlo
    this.panel.style.visibility = 'hidden';
    this.panel.style.display = 'block';
    const panelRect = this.panel.getBoundingClientRect();
    this.panel.style.visibility = 'visible';
    this.panel.style.display = '';
    
    // Ajustar si se sale de la pantalla horizontalmente
    if (left + panelRect.width > window.innerWidth) {
      left = window.innerWidth - panelRect.width - 10;
    }
    if (left < 10) {
      left = 10;
    }
    
    // Ajustar si se sale de la pantalla verticalmente
    if (top + panelRect.height > window.innerHeight) {
      top = btnRect.top - panelRect.height - 8;
    }
    if (top < 10) {
      top = 10;
    }
    
    this.panel.style.top = `${top}px`;
    this.panel.style.left = `${left}px`;
    this.panel.style.transform = 'none';
  }

  hidePanel() {
    this.panel.classList.add('hidden');
  }

  switchCategory(category) {
    this.currentCategory = category;
    this.loadEmojis(category);
  }

  updateActiveCategory(activeBtn) {
    this.categoryBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  loadEmojis(category) {
    const emojis = this.categories[category] || [];
    this.grid.innerHTML = '';
    
    emojis.forEach(emoji => {
      const emojiItem = document.createElement('div');
      emojiItem.className = 'emoji-item';
      emojiItem.textContent = emoji;
      emojiItem.title = emoji;
      emojiItem.addEventListener('click', () => {
        this.insertEmoji(emoji);
      });
      this.grid.appendChild(emojiItem);
    });
  }

  insertEmoji(emoji) {
    if (!this.editor) return;
    
    // Obtener posición del cursor
    const cursorPos = this.editor.selectionStart;
    const textBefore = this.editor.value.substring(0, cursorPos);
    const textAfter = this.editor.value.substring(cursorPos);
    
    // Insertar emoji
    this.editor.value = textBefore + emoji + textAfter;
    
    // Restaurar foco y posición del cursor
    const newCursorPos = cursorPos + emoji.length;
    this.editor.setSelectionRange(newCursorPos, newCursorPos);
    this.editor.focus();
    
    // Agregar a recientes
    this.addToRecent(emoji);
    
    // Actualizar contador de caracteres si existe
    if (window.app && window.app.updateStatus) {
      window.app.updateStatus();
    }
    
    // Cerrar panel
    this.hidePanel();
    
    console.log(`Emoji insertado: ${emoji}`);
  }

  addToRecent(emoji) {
    // Obtener recientes del localStorage
    let recent = this.getRecentEmojis();
    
    // Remover si ya existe
    recent = recent.filter(e => e !== emoji);
    
    // Agregar al inicio
    recent.unshift(emoji);
    
    // Limitar a 32 emojis recientes
    recent = recent.slice(0, 32);
    
    // Guardar en localStorage
    localStorage.setItem('emojiRecent', JSON.stringify(recent));
    
    // Actualizar categoría de recientes
    this.categories.recent = recent;
    
    // Si estamos en la categoría recientes, recargar
    if (this.currentCategory === 'recent') {
      this.loadEmojis('recent');
    }
  }

  getRecentEmojis() {
    try {
      const recent = localStorage.getItem('emojiRecent');
      if (recent) {
        return JSON.parse(recent);
      }
    } catch (error) {
      console.warn('Error loading recent emojis:', error);
    }
    
    // Emojis por defecto si no hay recientes
    return ['😀', '👍', '❤️', '🎉', '✅', '📝', '💡', '🚀'];
  }

  // Método público para agregar nuevas categorías
  addCategory(name, emojis) {
    this.categories[name] = emojis;
  }

  // Método para obtener estadísticas de uso
  getStats() {
    return {
      categories: Object.keys(this.categories).length,
      totalEmojis: Object.values(this.categories).flat().length,
      recentCount: this.categories.recent.length
    };
  }
}

// Exportar para uso global
window.EmojiManager = EmojiManager;