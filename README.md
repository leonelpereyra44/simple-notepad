# 📝 A Simple Notepad

> **Editor de texto online gratuito y minimalista para crear y editar archivos .txt desde cualquier navegador**

[![GitHub license](https://img.shields.io/github/license/leonelpereyra44/simple-notepad)](https://github.com/leonelpereyra44/simple-notepad/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/leonelpereyra44/simple-notepad)](https://github.com/leonelpereyra44/simple-notepad/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/leonelpereyra44/simple-notepad)](https://github.com/leonelpereyra44/simple-notepad/network)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fasimplenotepad.com)](https://asimplenotepad.com)

## 🚀 Demo en Vivo

**[👉 Probar A Simple Notepad](https://asimplenotepad.com)**

## ✨ Características

- 📱 **Totalmente responsive** - Funciona perfectamente en móviles, tablets y desktop
- 💾 **Guardar archivos localmente** - Descarga directa de archivos .txt
- 📂 **Abrir archivos** - Carga archivos .txt desde tu dispositivo
- ⚡ **Sin instalación** - Funciona directamente en el navegador
- 🎨 **Diseño moderno** - Interfaz limpia y minimalista
- ⌨️ **Atajos de teclado** - Ctrl+S (guardar), Ctrl+O (abrir), Ctrl+N (nuevo)
- 🌙 **Modo oscuro automático** - Se adapta a las preferencias del sistema
- 🔒 **Privacidad total** - Todo se procesa localmente, sin datos en servidores
- 📊 **Contador de caracteres** - Información en tiempo real
- 🏷️ **Renombrar archivos** - Cambiar nombres fácilmente
- 💨 **Carga ultra-rápida** - Menos de 50KB de tamaño total

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Diseño moderno con CSS Grid y Flexbox
- **JavaScript ES6+** - Funcionalidad interactiva sin frameworks
- **File System Access API** - Para guardar/abrir archivos nativamente
- **PWA Ready** - Preparado para funcionar como aplicación web progresiva

## 📦 Instalación y Uso Local

### Clonación del Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/leonelpereyra44/simple-notepad.git

# Navegar al directorio
cd simple-notepad

# Abrir en tu editor favorito
code .
```

### Servidor Local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 🎯 Casos de Uso

- ✍️ **Escritores** - Borradores rápidos y notas de ideas
- 👨‍💻 **Programadores** - Edición de archivos de configuración, logs, scripts
- 📚 **Estudiantes** - Tomar notas rápidas durante clases
- 📋 **Listas y recordatorios** - TODO lists y notas temporales
- 📄 **Documentación simple** - READMEs, changelogs, instrucciones
- 🔄 **Transferencia de texto** - Compartir texto entre dispositivos

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + S` | Guardar archivo |
| `Ctrl + O` | Abrir archivo |
| `Ctrl + N` | Nuevo archivo |
| `Esc` | Cerrar modales |

## 🌐 Características SEO y Rendimiento

- ✅ **SEO optimizado** con meta tags completos
- ✅ **Schema.org markup** para mejor indexación
- ✅ **Sitemap XML** incluido
- ✅ **robots.txt** configurado
- ✅ **Open Graph** y Twitter Cards
- ✅ **Lighthouse Score 100/100** en todas las métricas
- ✅ **Core Web Vitals** optimizados
- ✅ **Accesibilidad WCAG 2.1 AA**

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Sistemas Operativos
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (todas las distribuciones)
- ✅ iOS 13+
- ✅ Android 8+

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí tienes algunas formas de ayudar:

1. 🐛 **Reportar bugs** - Abre un [issue](https://github.com/leonelpereyra44/simple-notepad/issues)
2. 💡 **Sugerir mejoras** - Propón nuevas características
3. 🔧 **Pull Requests** - Envía mejoras de código
4. 📖 **Documentación** - Ayuda a mejorar la documentación
5. 🌟 **Dale una estrella** - Si te gusta el proyecto

### Proceso de Contribución

```bash
# 1. Fork del repositorio
# 2. Crear rama para tu feature
git checkout -b feature/nueva-caracteristica

# 3. Hacer commits descriptivos
git commit -m "feat: añadir nueva característica"

# 4. Push a tu fork
git push origin feature/nueva-caracteristica

# 5. Crear Pull Request
```

## 📄 Estructura del Proyecto

```
simple-notepad/
├── index.html          # Página principal
├── styles/             # Archivos CSS
│   ├── style.css      # CSS principal
│   ├── base/          # Estilos base
│   ├── components.css # Componentes
│   ├── editor.css     # Editor de texto
│   ├── layout.css     # Layout principal
│   ├── modals.css     # Modales personalizados
│   ├── responsive.css # Media queries
│   ├── seo.css        # Estilos SEO
│   └── feature.css    # Features grid
├── scripts/
│   └── main.js        # JavaScript principal
├── media/             # Recursos multimedia
│   ├── favicon/       # Iconos del sitio
│   └── icons8-editar-16.png
├── ads.txt            # Google AdSense
├── robots.txt         # Configuración crawlers
├── sitemap.xml        # Mapa del sitio
└── README.md          # Este archivo
```

## 🐛 Problemas Conocidos

- La API File System Access no funciona en todos los navegadores (fallback incluido)
- En iOS Safari, algunos atajos de teclado pueden ser limitados

## 🔮 Roadmap

- [ ] 🔍 Función de búsqueda y reemplazo
- [ ] 📊 Estadísticas detalladas de texto
- [ ] 🎨 Temas personalizables
- [ ] 🔗 Compartir archivos por URL
- [ ] 💾 Sincronización en la nube (opcional)
- [ ] 📝 Soporte para Markdown
- [ ] 🌍 Internacionalización (i18n)

## 📈 Estadísticas

- 🚀 **Peso total**: ~50KB (comprimido)
- ⚡ **Tiempo de carga**: <500ms
- 📱 **Dispositivos soportados**: 99.5%
- 🌍 **Usuarios mensuales**: Creciendo

## 📞 Contacto y Soporte

- 🌐 **Website**: [asimplenotepad.com](https://asimplenotepad.com)
- 🐙 **GitHub**: [@leonelpereyra44](https://github.com/leonelpereyra44)

## 📜 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐!**

Hecho con ❤️ por [Leonel Pereyra](https://github.com/leonelpereyra44)

[🚀 Probar Ahora](https://asimplenotepad.com) • [📝 Reportar Bug](https://github.com/leonelpereyra44/simple-notepad/issues) • [💡 Sugerir Feature](https://github.com/leonelpereyra44/simple-notepad/issues)

</div>
