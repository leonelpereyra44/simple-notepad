// Cookie Manager Module - centralizado para todas las páginas
// Responsabilidades:
//  - Cargar / persistir preferencias de cookies en localStorage
//  - Exponer API global window.cookieManager
//  - Gestionar modal reutilizable si existe en el DOM
//  - Emitir eventos para otros módulos (p.ej. advertisingConsentChanged)
//  - Hooks para habilitar/inhabilitar Analytics y Ads

(function(){
  const LS_KEY = 'cookiePreferences';
  const VERSION_KEY = 'cookiePreferencesVersion';
  const CURRENT_VERSION = 1; // incrementar si cambia el significado de las categorías

  class CookieManager {
    constructor() {
      this.preferences = this._load();
      this._ensureVersion();
      this._bindAutoInit();
      this.apply();
    }

    // Cargar preferencias guardadas o defaults
    _load() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return { essential: true, analytics: false, advertising: false };
        const data = JSON.parse(raw);
        return Object.assign({ essential: true, analytics: false, advertising: false }, data);
      } catch(e) {
        console.warn('[CookieManager] Error cargando preferencias, usando defaults', e);
        return { essential: true, analytics: false, advertising: false };
      }
    }

    _ensureVersion() {
      const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0', 10);
      if (storedVersion < CURRENT_VERSION) {
        // Si hubiera migraciones, se harían aquí
        localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
      }
    }

    save(partial) {
      this.preferences = { ...this.preferences, ...partial, essential: true };
      localStorage.setItem(LS_KEY, JSON.stringify(this.preferences));
      this.apply();
      this._toast('✅ Preferencias de cookies guardadas');
      document.dispatchEvent(new CustomEvent('cookiePreferencesSaved', { detail: this.preferences }));
    }

    apply() {
      // Analytics
      if (this.preferences.analytics) {
        this._enableAnalytics();
      } else {
        this._disableAnalytics();
      }

      // Advertising
      document.dispatchEvent(new CustomEvent('advertisingConsentChanged', {
        detail: { granted: !!this.preferences.advertising }
      }));
    }

    _enableAnalytics() {
      // Placeholder para carga diferida real de GA
      if (!window.__gaLoaded) {
        console.log('[CookieManager] Habilitando Google Analytics (placeholder)');
        // Aquí podrías inyectar el script real cuando tengas tu ID
        window.__gaLoaded = true;
      }
    }

    _disableAnalytics() {
      console.log('[CookieManager] Deshabilitando Google Analytics');
      // Borrar cookies GA conocidas (un subconjunto)
      ['_ga','_gid','_gat'].forEach(name => {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      });
    }

    consentGiven() {
      return !!localStorage.getItem(LS_KEY);
    }

    // Modal reutilizable si existe estructura similar
    initModal(root=document) {
      const modal = root.getElementById('cookieModal');
      const manageBtn = root.getElementById('manageCookies');
      if (!modal || !manageBtn) return; // Página sin modal

      const analyticsCb = root.getElementById('analytics');
      const advertisingCb = root.getElementById('advertising');
      const acceptAllBtn = root.getElementById('acceptAll');
      const saveBtn = root.getElementById('savePreferences');
      const rejectBtn = root.getElementById('rejectOptional');
      const closeBtn = root.getElementById('closeCookieModal');

      const open = () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden','false');
        // Enfocar el título si existe
        const h2 = modal.querySelector('h2');
        if (h2) h2.setAttribute('tabindex','-1');
        if (h2) h2.focus();
      };
      const close = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.setAttribute('aria-hidden','true');
        manageBtn.focus();
      };

      manageBtn.addEventListener('click', open);
      if (closeBtn) closeBtn.addEventListener('click', close);
      modal.addEventListener('click', e => { if (e.target === modal) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

      // Cargar estado inicial en checkboxes
      if (analyticsCb) analyticsCb.checked = !!this.preferences.analytics;
      if (advertisingCb) advertisingCb.checked = !!this.preferences.advertising;

      if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => { this.save({ analytics: true, advertising: true }); close(); });
      if (saveBtn) saveBtn.addEventListener('click', () => { this.save({ analytics: analyticsCb?.checked, advertising: advertisingCb?.checked }); close(); });
      if (rejectBtn) rejectBtn.addEventListener('click', () => { this.save({ analytics: false, advertising: false }); close(); });

      console.log('[CookieManager] Modal inicializado');
    }

    _toast(msg) {
      const div = document.createElement('div');
      div.className = 'cookie-confirmation';
      div.textContent = msg;
      document.body.appendChild(div);
      setTimeout(()=> div.remove(), 3000);
    }

    _bindAutoInit() {
      // Intentar inicializar automáticamente si la estructura existe tras DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => {
        this.initModal();
      });
    }
  }

  // Exponer singleton
  window.cookieManager = new CookieManager();
})();
