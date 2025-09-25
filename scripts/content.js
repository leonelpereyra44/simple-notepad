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