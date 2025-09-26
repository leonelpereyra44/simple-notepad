/**
 * Gestor de Publicidad y Cookies RGPD
 * Maneja AdSense, cookies de terceros y compliance con RGPD
 */

class AdManager {
  constructor() {
    this.adsenseClientId = 'ca-pub-5996058227168327';
    this.consentGranted = false;
    this.adsenseLoaded = false;
    this.adElements = [];
  }

  // Inicializar el gestor de publicidad
  initialize() {
    this.loadUserConsent();
    this.setupConsentEvents();
    this.findAdElements();
    
    // Aplicar estado inicial basado en consentimiento guardado
    if (this.consentGranted) {
      this.enableAdvertising();
    } else {
      this.disableAdvertising();
    }
  }

  // Cargar consentimiento guardado del usuario
  loadUserConsent() {
    const consent = localStorage.getItem('adsense_consent');
    this.consentGranted = consent === 'true';
  }

  // Encontrar elementos de anuncios en la página
  findAdElements() {
    this.adElements = document.querySelectorAll('.adsbygoogle, [data-ad-slot]');
  }

  // Configurar eventos de consentimiento
  setupConsentEvents() {
    // Escuchar cambios en el toggle de cookies
    document.addEventListener('advertisingConsentChanged', (e) => {
      if (e.detail.granted) {
        this.enableAdvertising();
      } else {
        this.disableAdvertising();
      }
    });
  }

  // Habilitar publicidad personalizada
  enableAdvertising() {
    try {
      // 1. Guardar preferencia del usuario
      localStorage.setItem('adsense_consent', 'true');
      this.consentGranted = true;
      
      // 2. Cargar AdSense scripts si no están cargados
      this.loadAdSenseScript();
      
      // 3. Habilitar cookies de terceros para targeting
      this.setCookieConsent(true);
      
      // 4. Configurar Google Analytics con publicidad
      this.configureAnalyticsConsent(true);
      
      // 5. Mostrar anuncios personalizados
      this.showPersonalizedAds();
      
      // 6. Actualizar estado visual
      this.updateConsentStatus('granted');
      
      console.log('✅ Publicidad personalizada habilitada');
      
    } catch (error) {
      console.error('Error habilitando publicidad personalizada:', error);
    }
  }

  // Deshabilitar publicidad personalizada
  disableAdvertising() {
    try {
      // 1. Guardar preferencia del usuario
      localStorage.setItem('adsense_consent', 'false');
      this.consentGranted = false;
      
      // 2. Eliminar cookies de publicidad
      this.clearAdvertisingCookies();
      
      // 3. Configurar Google Analytics sin publicidad
      this.configureAnalyticsConsent(false);
      
      // 4. Mostrar anuncios genéricos (sin personalización)
      this.showGenericAds();
      
      // 5. Actualizar estado visual
      this.updateConsentStatus('denied');
      
      console.log('❌ Publicidad personalizada deshabilitada - Mostrando anuncios genéricos');
      
    } catch (error) {
      console.error('Error deshabilitando publicidad personalizada:', error);
    }
  }

  // Cargar script de AdSense dinámicamente
  loadAdSenseScript() {
    if (this.adsenseLoaded || document.querySelector(`script[src*="${this.adsenseClientId}"]`)) {
      return;
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adsenseClientId}`;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      this.adsenseLoaded = true;
      this.initializeAds();
    };
    
    script.onerror = () => {
      console.error('Error cargando AdSense script');
    };
    
    document.head.appendChild(script);
  }

  // Inicializar anuncios después de cargar AdSense
  initializeAds() {
    if (window.adsbygoogle && this.consentGranted) {
      this.adElements.forEach(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('Error inicializando anuncio:', e);
        }
      });
    }
  }

  // Configurar cookies de consentimiento
  setCookieConsent(granted) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 año
    
    const cookieValue = granted ? 'granted' : 'denied';
    document.cookie = `ads_consent=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  // Eliminar cookies de publicidad
  clearAdvertisingCookies() {
    const adCookies = [
      'ads_consent',
      '__gads',
      '__gpi', 
      'IDE', // DoubleClick
      'test_cookie',
      'ANID',
      'DSID',
      '_gcl_au', // Google Ads
      '_gac_gb_', // Google Ads Conversion
      'NID' // Google tracking
    ];
    
    const domains = [
      '',
      '.googlesyndication.com',
      '.google.com', 
      '.doubleclick.net',
      '.googleadservices.com',
      '.googletagmanager.com'
    ];
    
    adCookies.forEach(cookieName => {
      domains.forEach(domain => {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainPart}`;
      });
    });
  }

  // Configurar Google Analytics consent
  configureAnalyticsConsent(granted) {
    if (typeof gtag === 'undefined') {
      return;
    }
    
    gtag('consent', 'update', {
      'ad_storage': granted ? 'granted' : 'denied',
      'ad_user_data': granted ? 'granted' : 'denied',
      'ad_personalization': granted ? 'granted' : 'denied',
      'analytics_storage': 'granted' // Analytics siempre habilitado
    });
  }

  // Mostrar anuncios personalizados
  showPersonalizedAds() {
    this.adElements.forEach(ad => {
      ad.style.display = 'block';
      ad.removeAttribute('data-npa'); // Permitir anuncios personalizados
      ad.removeAttribute('data-adbreak-test');
    });
    
    // Reinicializar anuncios si AdSense está cargado
    if (this.adsenseLoaded) {
      this.initializeAds();
    }
  }

  // Mostrar anuncios genéricos (sin personalización)
  showGenericAds() {
    this.adElements.forEach(ad => {
      ad.style.display = 'block';
      ad.setAttribute('data-npa', '1'); // No Personalized Ads
    });
    
    // Reinicializar anuncios en modo no personalizado
    if (this.adsenseLoaded) {
      setTimeout(() => {
        this.initializeAds();
      }, 100);
    }
  }

  // Actualizar estado visual del consentimiento
  updateConsentStatus(status) {
    // Actualizar toggle en cookies.html si existe
    const toggle = document.getElementById('advertising-toggle');
    if (toggle) {
      toggle.checked = (status === 'granted');
    }
    
    // Emitir evento para otros componentes
    document.dispatchEvent(new CustomEvent('adConsentUpdated', {
      detail: { status, granted: status === 'granted' }
    }));
  }

  // Obtener estado actual del consentimiento
  getConsentStatus() {
    return {
      granted: this.consentGranted,
      adsenseLoaded: this.adsenseLoaded,
      adElementsCount: this.adElements.length
    };
  }

  // Método para debugging (solo en desarrollo)
  debug() {
    if (location.hostname === 'localhost' || location.protocol === 'file:') {
      console.log('🎯 AdManager Status:', this.getConsentStatus());
      console.log('📊 Ad Elements:', this.adElements);
      console.log('🍪 Consent Cookie:', localStorage.getItem('adsense_consent'));
    }
  }
}

// Hacer AdManager disponible globalmente
window.AdManager = AdManager;