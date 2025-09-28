// JavaScript para páginas de contenido
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordions
    setupFAQAccordions();
    
    // FAQ Search
    setupFAQSearch();
    
    // FAQ Filters
    setupFAQFilters();
    
    // Contact Form Enhancement
    setupContactForm();
    
    // Tutorial Navigation
    setupTutorialNavigation();
    
    // Cookie Settings (si existe el banner)
    if (typeof window.cookieBanner !== 'undefined') {
        setupCookieSettings();
    }
});

function setupFAQAccordions() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.style.display === 'block';
            
            // Cerrar todas las respuestas
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.display = 'none';
                a.previousElementSibling.classList.remove('active');
            });
            
            // Abrir la seleccionada si no estaba abierta
            if (!isOpen) {
                answer.style.display = 'block';
                this.classList.add('active');
            }
        });
    });
}

function setupFAQSearch() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function setupFAQFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            const faqItems = document.querySelectorAll('.faq-item');
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar items
            faqItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Procesar envío del formulario
        showSuccessMessage();
        
        // Mostrar información sobre el navegador
        showBrowserInfo();
    });
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px;">
            <h3 style="color: #2e7d32; margin-bottom: 1rem;">✅ ¡Mensaje enviado!</h3>
            <p style="color: #2e7d32; margin-bottom: 1rem;">
                Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos en 24-48 horas.
            </p>
            <p style="color: #666; font-size: 14px;">
                Si necesitas ayuda inmediata, consulta nuestro 
                <a href="faq.html" style="color: #2e7d32;">FAQ</a> o 
                <a href="tutorial.html" style="color: #2e7d32;">tutorial</a>.
            </p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Enviar otro mensaje
            </button>
        </div>
    `;
}

function showBrowserInfo() {
    const browserInfo = document.getElementById('browser-info');
    if (!browserInfo) return;
    
    const userAgent = navigator.userAgent;
    let browserName = 'Desconocido';
    
    if (userAgent.indexOf('Chrome') > -1) browserName = 'Chrome';
    else if (userAgent.indexOf('Firefox') > -1) browserName = 'Firefox';
    else if (userAgent.indexOf('Safari') > -1) browserName = 'Safari';
    else if (userAgent.indexOf('Edge') > -1) browserName = 'Edge';
    
    browserInfo.innerHTML = `
        <p><strong>Navegador detectado:</strong> ${browserName}</p>
        <p><strong>Nota:</strong> Formulario enviado exitosamente. Te contactaremos pronto.</p>
    `;
    browserInfo.style.display = 'block';
}

function setupTutorialNavigation() {
    const sections = document.querySelectorAll('.tutorial-content section');
    if (sections.length === 0) return;
    
    // Crear navegación
    const nav = document.createElement('nav');
    nav.className = 'tutorial-nav';
    nav.innerHTML = '<h3>Contenido</h3><ul></ul>';
    
    const ul = nav.querySelector('ul');
    
    sections.forEach((section, index) => {
        const heading = section.querySelector('h2');
        if (heading) {
            const id = `section-${index}`;
            section.id = id;
            
            const li = document.createElement('li');
            li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
            ul.appendChild(li);
        }
    });
    
    // Insertar navegación al inicio del contenido
    const content = document.querySelector('.tutorial-content');
    if (content && content.children.length > 1) {
        content.insertBefore(nav, content.children[1]);
    }
    
    // Smooth scroll
    nav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

function setupCookieSettings() {
    const settingsButtons = document.querySelectorAll('.cookie-settings-btn');
    
    settingsButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.cookieBanner && window.cookieBanner.showSettings) {
                window.cookieBanner.showSettings();
            }
        });
    });
}

// Utilidades
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para copiar templates
function copyTemplate(templateId) {
    const templates = {
        'blog-template': `# Título del Artículo

## Introducción
[Escribe una introducción atractiva que enganche al lector]

## Desarrollo

### Subtítulo 1
[Contenido principal del primer punto]

### Subtítulo 2  
[Contenido principal del segundo punto]

### Subtítulo 3
[Contenido principal del tercer punto]

## Conclusión
[Resume los puntos clave y ofrece una reflexión final]

---
Palabras clave: [palabra1, palabra2, palabra3]
Fecha: ${new Date().toLocaleDateString('es-ES')}`,

        'proposal-template': `# PROPUESTA: [Título del Proyecto]

## RESUMEN EJECUTIVO
[Breve descripción del proyecto y objetivos principales]

## OBJETIVOS
- Objetivo principal: [Describir objetivo principal]
- Objetivos específicos:
  • [Objetivo 1]
  • [Objetivo 2] 
  • [Objetivo 3]

## ALCANCE DEL PROYECTO
### Incluye:
- [Elemento 1]
- [Elemento 2]
- [Elemento 3]

### No incluye:
- [Exclusión 1]
- [Exclusión 2]

## METODOLOGÍA
1. **Fase 1:** [Descripción fase inicial]
2. **Fase 2:** [Descripción desarrollo]  
3. **Fase 3:** [Descripción cierre]

## CRONOGRAMA
- **Inicio:** [Fecha]
- **Hito 1:** [Fecha] - [Descripción]
- **Hito 2:** [Fecha] - [Descripción]
- **Entrega final:** [Fecha]

## PRESUPUESTO
| Concepto | Cantidad | Precio |
|----------|----------|---------|
| [Item 1] | [X] | [Precio] |
| [Item 2] | [X] | [Precio] |
| **TOTAL** |  | **[Total]** |

## BENEFICIOS ESPERADOS
- [Beneficio 1]
- [Beneficio 2]
- [Beneficio 3]

---
Elaborado por: [Tu nombre]
Fecha: ${new Date().toLocaleDateString('es-ES')}`,

        'report-template': `# REPORTE: [Título del Reporte]

**Fecha:** ${new Date().toLocaleDateString('es-ES')}
**Elaborado por:** [Tu nombre]
**Periodo:** [Fecha inicio - Fecha fin]

## RESUMEN EJECUTIVO
[Resumen de 2-3 párrafos con los puntos más importantes]

## METODOLOGÍA
[Explicar cómo se obtuvieron los datos y se realizó el análisis]

## RESULTADOS PRINCIPALES

### Hallazgo 1: [Título]
- **Descripción:** [Detalle del hallazgo]
- **Impacto:** [Nivel de importancia]
- **Datos:** [Cifras o evidencia]

### Hallazgo 2: [Título]  
- **Descripción:** [Detalle del hallazgo]
- **Impacto:** [Nivel de importancia]
- **Datos:** [Cifras o evidencia]

### Hallazgo 3: [Título]
- **Descripción:** [Detalle del hallazgo] 
- **Impacto:** [Nivel de importancia]
- **Datos:** [Cifras o evidencia]

## ANÁLISIS DE TENDENCIAS
[Identificar patrones y tendencias observadas]

## RIESGOS IDENTIFICADOS
1. **Riesgo Alto:** [Descripción y mitigación]
2. **Riesgo Medio:** [Descripción y mitigación]
3. **Riesgo Bajo:** [Descripción y monitoreo]

## RECOMENDACIONES

### Acción Inmediata
- [ ] [Acción 1] - Responsable: [Persona] - Fecha: [Fecha]
- [ ] [Acción 2] - Responsable: [Persona] - Fecha: [Fecha]

### Mediano Plazo  
- [ ] [Acción 1] - Responsable: [Persona] - Fecha: [Fecha]
- [ ] [Acción 2] - Responsable: [Persona] - Fecha: [Fecha]

## CONCLUSIONES
[Síntesis final y próximos pasos]

---
**Próxima revisión:** [Fecha]
**Distribución:** [Lista de destinatarios]`,

        'content-plan-template': `# PLAN DE CONTENIDO: [Mes/Trimestre/Año]

## OBJETIVOS
- **Objetivo principal:** [Describir meta principal]
- **Métricas clave:** 
  • [Métrica 1]: [Meta numérica]
  • [Métrica 2]: [Meta numérica]
  • [Métrica 3]: [Meta numérica]

## AUDIENCIA OBJETIVO
- **Demografía:** [Edad, ubicación, intereses]
- **Necesidades:** [Qué problemas resolvemos]
- **Canales preferidos:** [Donde consume contenido]

## CALENDARIO EDITORIAL

### SEMANA 1
**Lunes:** [Tipo de contenido] - [Título/Tema]
**Miércoles:** [Tipo de contenido] - [Título/Tema]  
**Viernes:** [Tipo de contenido] - [Título/Tema]

### SEMANA 2
**Lunes:** [Tipo de contenido] - [Título/Tema]
**Miércoles:** [Tipo de contenido] - [Título/Tema]
**Viernes:** [Tipo de contenido] - [Título/Tema]

### SEMANA 3
**Lunes:** [Tipo de contenido] - [Título/Tema]
**Miércoles:** [Tipo de contenido] - [Título/Tema]
**Viernes:** [Tipo de contenido] - [Título/Tema]

### SEMANA 4
**Lunes:** [Tipo de contenido] - [Título/Tema]
**Miércoles:** [Tipo de contenido] - [Título/Tema]
**Viernes:** [Tipo de contenido] - [Título/Tema]

## TIPOS DE CONTENIDO

### Educativo (40%)
- Tutoriales
- Guías paso a paso
- Tips y consejos

### Entretenimiento (30%)
- Historias personales
- Contenido viral
- Humor relacionado

### Promocional (20%)
- Productos/servicios
- Testimonios
- Ofertas especiales  

### Interactivo (10%)
- Preguntas al audience
- Encuestas
- Contenido generado por usuarios

## PALABRAS CLAVE OBJETIVO
1. [Palabra clave 1] - Volumen: [X] - Dificultad: [Baja/Media/Alta]
2. [Palabra clave 2] - Volumen: [X] - Dificultad: [Baja/Media/Alta]  
3. [Palabra clave 3] - Volumen: [X] - Dificultad: [Baja/Media/Alta]

## RECURSOS NECESARIOS
- **Herramientas:** [Lista de tools needed]
- **Personal:** [Roles y responsabilidades]
- **Presupuesto:** [Costo estimado]

## MEDICIÓN Y ANÁLISIS
- **Revisión semanal:** [Qué métricas revisar]
- **Reporte mensual:** [KPIs principales]
- **Ajustes:** [Criterios para modificar el plan]

---
**Creado:** ${new Date().toLocaleDateString('es-ES')}
**Próxima revisión:** [Fecha]`
    };
    
    const templateContent = templates[templateId];
    
    if (templateContent) {
        // Copiar al clipboard
        navigator.clipboard.writeText(templateContent).then(() => {
            // Mostrar confirmación
            showCopyConfirmation();
        }).catch(err => {
            console.error('Error al copiar:', err);
            // Fallback para navegadores antiguos
            fallbackCopyTextToClipboard(templateContent);
        });
    } else {
        alert('Template no encontrado');
    }
}

// Función de fallback para copiar texto
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyConfirmation();
    } catch (err) {
        alert('No se pudo copiar el template');
    }
    
    document.body.removeChild(textArea);
}

// Mostrar confirmación de copiado
function showCopyConfirmation() {
    // Crear elemento de confirmación
    const confirmation = document.createElement('div');
    confirmation.innerHTML = '✅ Template copiado al portapapeles';
    confirmation.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(confirmation);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        confirmation.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 300);
    }, 3000);
}

// Hacer la función global para que funcione desde HTML
window.copyTemplate = copyTemplate;

// Agregar botón scroll to top si la página es larga
if (document.body.scrollHeight > window.innerHeight * 2) {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.title = 'Volver arriba';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px;
        border: none;
        border-radius: 50%;
        background: var(--accent);
        color: white;
        font-size: 18px;
        cursor: pointer;
        display: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all var(--transition);
    `;
    
    scrollBtn.addEventListener('click', scrollToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    document.body.appendChild(scrollBtn);
}

// Mejorar accesibilidad
document.addEventListener('keydown', function(e) {
    // Escape para cerrar FAQ abierto
    if (e.key === 'Escape') {
        const activeFaq = document.querySelector('.faq-question.active');
        if (activeFaq) {
            activeFaq.click();
        }
    }
});

// Analytics para páginas de contenido
if (typeof gtag !== 'undefined') {
    // Track FAQ interactions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('faq-question')) {
            gtag('event', 'faq_open', {
                event_category: 'FAQ',
                event_label: e.target.textContent.trim()
            });
        }
    });
    
    // Track contact form submissions
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            gtag('event', 'contact_form_submit', {
                event_category: 'Contact'
            });
        });
    }
}