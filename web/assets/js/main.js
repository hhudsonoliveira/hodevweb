/* =====================================================
   MAIN.JS - HoDevWeb
   Funcionalidades principais e inicializacao
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ============ LOADING SCREEN ============
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    // Tempo minimo de exibicao para mostrar a animacao
    const minLoadTime = 2000;
    const startTime = Date.now();

    window.addEventListener('load', () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove do DOM apos a animacao
        setTimeout(() => {
          loadingScreen.remove();
        }, 800);
      }, remainingTime);
    });
  }

  // ============ SCROLL PROGRESS BAR ============
  initScrollProgress();

  // ============ HEADER SCROLL EFFECT ============
  initHeaderScroll();

  // ============ MOBILE NAVIGATION ============
  initMobileNav();

  // ============ SMOOTH SCROLL ============
  initSmoothScroll();

  // ============ BACK TO TOP BUTTON ============
  initBackToTop();

  // ============ FORM HANDLING ============
  initFormHandling();

  // ============ TYPING EFFECT ============
  initTypingEffect();

  // ============ LAZY LOADING ============
  initLazyLoading();

  // ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
  initIntersectionAnimations();
});

// ============ SCROLL PROGRESS BAR ============
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });
}

// ============ HEADER SCROLL EFFECT ============
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show header on scroll (optional)
    if (currentScroll > lastScroll && currentScroll > 500) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });
}

// ============ MOBILE NAVIGATION ============
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');

  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Close menu on link click
  const navLinks = navList.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) {
      toggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// ============ BACK TO TOP BUTTON ============
function initBackToTop() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  `;
  button.setAttribute('aria-label', 'Voltar ao topo');
  document.body.appendChild(button);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============ FORM HANDLING ============
function initFormHandling() {
  const form = document.querySelector('.contact__form form, .form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simulate form submission (replace with actual API call)
    try {
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Here you would send data to your backend
      console.log('Form data:', data);

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success feedback
      submitBtn.textContent = 'Enviado!';
      submitBtn.style.background = '#25D366';

      // Reset form
      form.reset();

      // Reset button after delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);

    } catch (error) {
      console.error('Form error:', error);
      submitBtn.textContent = 'Erro ao enviar';
      submitBtn.style.background = '#ff4444';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
      }, 3000);
    }
  });

  // Input focus effects
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
}

// ============ TYPING EFFECT ============
function initTypingEffect() {
  const typingElements = document.querySelectorAll('[data-typing]');

  typingElements.forEach(el => {
    const text = el.dataset.typing || el.textContent;
    const speed = parseInt(el.dataset.speed) || 50;

    el.textContent = '';
    el.style.visibility = 'visible';

    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    // Start typing when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });
}

// ============ LAZY LOADING ============
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ============ INTERSECTION OBSERVER FOR CSS ANIMATIONS ============
function initIntersectionAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  } else {
    // Fallback: show all elements
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }
}

// ============ UTILITY FUNCTIONS ============

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============ WHATSAPP BUTTON PULSE ============
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
  // Add pulse animation
  setInterval(() => {
    whatsappBtn.classList.add('pulse');
    setTimeout(() => whatsappBtn.classList.remove('pulse'), 1000);
  }, 5000);
}

// ============ ACTIVE NAV LINK ON SCROLL ============
window.addEventListener('scroll', debounce(() => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}, 100));

// ============ PRELOAD CRITICAL RESOURCES ============
function preloadCriticalResources() {
  const criticalImages = [
    './assets/Logo.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Call preload
preloadCriticalResources();

// ============ CONSOLE EASTER EGG ============
console.log('%c HoDevWeb ', 'background: linear-gradient(135deg, #0066FF, #00D4FF); color: white; font-size: 24px; padding: 10px 20px; border-radius: 8px;');
console.log('%c Desenvolvimento Web Profissional ', 'color: #0066FF; font-size: 14px;');
console.log('%c Interessado em trabalhar conosco? Entre em contato! ', 'color: #666; font-size: 12px;');

// ============ MODAL DE PROJETOS ============

// Classe Project
class Project {
  constructor(title, description, icon, link) {
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.link = link;
  }
}

// Classe ProjectBuilder
class ProjectBuilder {
  constructor() {
    this.title = "";
    this.description = "";
    this.icon = "box";
    this.link = "#";
  }
  setTitle(title) {
    this.title = title;
    return this;
  }
  setDescription(description) {
    this.description = description;
    return this;
  }
  setIcon(icon) {
    this.icon = icon;
    return this;
  }
  setLink(link) {
    this.link = link;
    return this;
  }
  build() {
    return new Project(this.title, this.description, this.icon, this.link);
  }
}

// Classe ProjectsModal
class ProjectsModal {
  constructor(modalId, openBtnId, closeBtnId, projectsContainerId) {
    this.modal = document.getElementById(modalId);
    this.openBtn = document.getElementById(openBtnId);
    this.closeBtn = document.getElementById(closeBtnId);

    if (!this.modal || !this.openBtn || !this.closeBtn) {
      console.warn("Modal elements not found. Projects modal disabled.");
      return;
    }

    this.overlay = this.modal.querySelector(".modal__overlay");
    this.container = document.getElementById(projectsContainerId);

    this.initEvents();
  }

  initEvents() {
    if (!this.openBtn || !this.closeBtn) return;

    this.openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.open();
    });
    this.closeBtn.addEventListener("click", () => this.close());
    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.close());
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }

  open() {
    this.modal.classList.add("is-active");
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove("is-active");
    document.body.style.overflow = '';
  }

  renderProjects(projects) {
    if (!this.container) return;

    this.container.innerHTML = "";
    projects.forEach((p) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <div class="project-card__icon">
          <i data-lucide="${p.icon}" style="width: 64px; height: 64px; color: #fff;"></i>
        </div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer">Acessar</a>
      `;
      this.container.appendChild(card);
    });

    // Re-initialize Lucide icons after rendering
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// Inicializar Modal de Projetos
document.addEventListener('DOMContentLoaded', () => {
  // Projetos reais desenvolvidos pela Hodevweb
  const projects = [
    new ProjectBuilder()
      .setTitle("Caique Imobiliária")
      .setDescription("Site responsivo completo para imobiliária com design moderno e navegação intuitiva.")
      .setIcon("home")
      .setLink("https://hhudsonoliveira.github.io/caiquesnt-imobiliaria/")
      .build(),
    new ProjectBuilder()
      .setTitle("Barbearia Profissional")
      .setDescription("Website responsivo para barbearia com agendamento e galeria de serviços.")
      .setIcon("scissors")
      .setLink("https://hhudsonoliveira.github.io/Barbearia/")
      .build(),
    new ProjectBuilder()
      .setTitle("JV Beleza e Estética")
      .setDescription("Landing page de alta conversão para clínica de estética, focada em captação de clientes.")
      .setIcon("sparkles")
      .setLink("https://jvsaudebelezaestetica.com")
      .build(),
  ];

  // Inicializar o modal de projetos
  const modal = new ProjectsModal(
    "projectsModal",
    "openProjectsBtn",
    "closeModalBtn",
    "projectsContainer"
  );

  // Renderizar projetos no modal
  if (modal.container) {
    modal.renderProjects(projects);
  }
});
