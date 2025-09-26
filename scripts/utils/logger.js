/**
 * Sistema de logging profesional para Simple Notepad
 * Solo muestra logs en modo desarrollo
 */

// Detectar si estamos en desarrollo (localhost o file://)
const isDevelopment = 
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1' ||
  location.protocol === 'file:' ||
  location.search.includes('debug=true');

/**
 * Logger condicional - Solo logea en desarrollo
 */
const logger = {
  // Solo en desarrollo
  log: (...args) => isDevelopment && console.log(...args),
  info: (...args) => isDevelopment && console.info(...args),
  debug: (...args) => isDevelopment && console.debug(...args),
  
  // Siempre visibles (errores críticos)
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  
  // Método especial para inicialización
  init: (component, data) => {
    if (isDevelopment) {
      console.log(`🚀 ${component} inicializado:`, data);
    }
  },
  
  // Método para configuración
  config: (action, details) => {
    if (isDevelopment) {
      console.log(`⚙️ ${action}:`, details);
    }
  }
};

// Exportar para uso en módulos
export { logger, isDevelopment };