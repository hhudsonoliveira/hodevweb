/* =====================================================
   MAIN.JS - HoDevWeb
   Funcionalidades principais e inicializacao
   ===================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // ============ LOADING SCREEN ============
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    const minLoadTime = 2000;
    const startTime = Date.now();
    window.addEventListener('load', () => {
      const elapsed = Date.now() - startTime;
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 800);
      }, Math.max(0, minLoadTime - elapsed));
    });
  }

  // ============ UI SYNC (sem depender de async) ============
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initTypingEffect();
  initLazyLoading();
  initIntersectionAnimations();
  initClientsCarousel();

  // ============ EMAIL (async — não bloqueia UI) ============
  try {
    await loadEmailJS();
  } catch (err) {
    showFormAlert('error', 'Erro ao carregar sistema de email. Recarregue a página.');
    return;
  }

  const sendButton = document.getElementById('send');
  if (sendButton) sendButton.addEventListener('click', handleFormSubmit);

  const alertCloseBtn = document.getElementById('formAlertClose');
  if (alertCloseBtn) alertCloseBtn.addEventListener('click', hideFormAlert);

  // ============ MODAL DE TERMOS ============
  const termsModal    = document.getElementById('termsModal');
  const closeTermsBtn = document.getElementById('closeTermsBtn');
  const termsOverlay  = termsModal?.querySelector('.modal__overlay');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const confirmBtn    = document.getElementById('confirmTermsBtn');

  if (closeTermsBtn)  closeTermsBtn.addEventListener('click', closeTermsModal);
  if (termsOverlay)   termsOverlay.addEventListener('click', closeTermsModal);
  if (termsCheckbox && confirmBtn) {
    termsCheckbox.addEventListener('change', () => {
      confirmBtn.disabled = !termsCheckbox.checked;
    });
  }
  if (confirmBtn) confirmBtn.addEventListener('click', sendEmailAfterTerms);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal?.classList.contains('is-active')) closeTermsModal();
  });
});

// ============ SCROLL PROGRESS BAR ============
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop   = window.scrollY;
    const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
  });
}

// ============ HEADER SCROLL EFFECT ============
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    header.classList.toggle('scrolled', cur > 50);
    header.style.transform = (cur > lastScroll && cur > 500) ? 'translateY(-100%)' : 'translateY(0)';
    lastScroll = cur;
  });
}

// ============ MOBILE MENU ============
function initMobileMenu() {
  const navToggle   = document.querySelector('.nav__toggle');
  const navList     = document.querySelector('.nav__list');
  const navLinks    = document.querySelectorAll('.nav__link');
  const backdrop    = document.querySelector('.nav__backdrop');
  const drawerClose = document.querySelector('.nav__drawer-close');

  if (!navToggle || !navList) return;

  function openMenu() {
    navToggle.classList.add('active');
    navList.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    if (backdrop) { backdrop.style.opacity = '1'; backdrop.style.pointerEvents = 'auto'; }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    navList.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (backdrop) { backdrop.style.opacity = ''; backdrop.style.pointerEvents = ''; }
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navList.classList.contains('active') ? closeMenu() : openMenu();
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  if (backdrop)    backdrop.addEventListener('click', closeMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' });
    });
  });
}

// ============ BACK TO TOP ============
function initBackToTop() {
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
  button.setAttribute('aria-label', 'Voltar ao topo');
  document.body.appendChild(button);
  window.addEventListener('scroll', () => button.classList.toggle('visible', window.scrollY > 500));
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ TYPING EFFECT ============
function initTypingEffect() {
  document.querySelectorAll('[data-typing]').forEach(el => {
    const text  = el.dataset.typing || el.textContent;
    const speed = parseInt(el.dataset.speed) || 50;
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    function type() { if (i < text.length) { el.textContent += text.charAt(i++); setTimeout(type, speed); } }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { type(); obs.unobserve(el); } });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

// ============ LAZY LOADING ============
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px 0px' });
    lazyImages.forEach(img => obs.observe(img));
  } else {
    lazyImages.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  }
}

// ============ INTERSECTION ANIMATIONS ============
function initIntersectionAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => obs.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

// ============ CLIENTS CAROUSEL ============
function initClientsCarousel() {
  const marquee = document.querySelector('.clients-marquee');
  const track   = document.querySelector('.clients-track');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');

  if (!marquee || !track || !prevBtn || !nextBtn) return;

  const STEP  = 364;
  const SPEED = 0.5;
  let pos    = 0;
  let paused = false;
  let busy   = false;

  track.style.cssText = 'animation: none !important;';

  function half() { return track.scrollWidth / 2 || 1080; }

  (function tick() {
    if (!paused && !busy) {
      pos += SPEED;
      if (pos >= half()) pos -= half();
      track.style.transform = `translateX(-${pos}px)`;
    }
    requestAnimationFrame(tick);
  }());

  function go(dir) {
    if (busy) return;
    busy = true;
    const h      = half();
    const target = ((pos + dir * STEP) % h + h) % h;
    track.style.transition = 'transform 0.4s ease';
    track.style.transform  = `translateX(-${target}px)`;
    setTimeout(() => { pos = target; track.style.transition = ''; busy = false; }, 420);
  }

  prevBtn.addEventListener('click', () => go(-1));
  nextBtn.addEventListener('click', () => go(+1));
  marquee.addEventListener('mouseenter', () => { paused = true; });
  marquee.addEventListener('mouseleave', () => { paused = false; });
}

// ============ UTILITY FUNCTIONS ============
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ============ WHATSAPP BUTTON PULSE ============
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
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
    if (window.scrollY >= section.offsetTop - 200 && window.scrollY < section.offsetTop - 200 + section.offsetHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
}, 100));

// ============ PRELOAD ============
(function preloadCriticalResources() {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as  = 'image';
  link.href = './assets/Logo.png';
  document.head.appendChild(link);
}());

// ============ CONSOLE EASTER EGG ============
console.log('%c HoDevWeb ', 'background: linear-gradient(135deg, #0066FF, #00D4FF); color: white; font-size: 24px; padding: 10px 20px; border-radius: 8px;');
console.log('%c Desenvolvimento Web Profissional ', 'color: #0066FF; font-size: 14px;');
console.log('%c Interessado em trabalhar conosco? Entre em contato! ', 'color: #666; font-size: 12px;');

// ============ MODAL DE PROJETOS ============
class Project {
  constructor(title, description, icon, link) {
    this.title = title; this.description = description;
    this.icon = icon;   this.link = link;
  }
}

class ProjectBuilder {
  constructor() { this.title = ''; this.description = ''; this.icon = 'box'; this.link = '#'; }
  setTitle(t)       { this.title = t; return this; }
  setDescription(d) { this.description = d; return this; }
  setIcon(i)        { this.icon = i; return this; }
  setLink(l)        { this.link = l; return this; }
  build()           { return new Project(this.title, this.description, this.icon, this.link); }
}

class ProjectsModal {
  constructor(modalId, openBtnId, closeBtnId, projectsContainerId) {
    this.modal    = document.getElementById(modalId);
    this.openBtn  = document.getElementById(openBtnId);
    this.closeBtn = document.getElementById(closeBtnId);
    if (!this.modal || !this.openBtn || !this.closeBtn) return;
    this.overlay   = this.modal.querySelector('.modal__overlay');
    this.container = document.getElementById(projectsContainerId);
    this.initEvents();
  }
  initEvents() {
    if (!this.openBtn || !this.closeBtn) return;
    this.openBtn.addEventListener('click', (e) => { e.preventDefault(); this.open(); });
    this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
  }
  open()  { this.modal.classList.add('is-active');    document.body.style.overflow = 'hidden'; }
  close() { this.modal.classList.remove('is-active'); document.body.style.overflow = ''; }
  renderProjects(projects) {
    if (!this.container) return;
    this.container.innerHTML = '';
    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-card__icon"><i data-lucide="${p.icon}" style="width:64px;height:64px;color:#fff;"></i></div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer">Acessar</a>`;
      this.container.appendChild(card);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const projects = [
    new ProjectBuilder().setTitle('Caique Imobiliária').setDescription('Site responsivo completo para imobiliária com design moderno e navegação intuitiva.').setIcon('home').setLink('https://hhudsonoliveira.github.io/caiquesnt-imobiliaria/').build(),
    new ProjectBuilder().setTitle('Barbearia Profissional').setDescription('Website responsivo para barbearia com agendamento e galeria de serviços.').setIcon('scissors').setLink('https://hhudsonoliveira.github.io/Barbearia/').build(),
    new ProjectBuilder().setTitle('JV Beleza e Estética').setDescription('Landing page de alta conversão para clínica de estética, focada em captação de clientes.').setIcon('sparkles').setLink('https://jvsaudebelezaestetica.com').build(),
  ];
  const modal = new ProjectsModal('projectsModal', 'openProjectsBtn', 'closeModalBtn', 'projectsContainer');
  if (modal.container) modal.renderProjects(projects);
});

// ============================================================
// FORMULÁRIO DE CONTATO — SANITIZAÇÃO + EMAILJS + MODAL TERMOS
// ============================================================

function normalizeUnicode(str) { return (str ?? '').normalize('NFKC'); }

function stripControls(str, { keepNewlines = false } = {}) {
  const re = keepNewlines ? /[ --]/g : /[ -]/g;
  return str.replace(re, '');
}

function sanitizeName(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s);
  s = s.replace(/[^\p{L}\s'-]/gu, '');
  return s.replace(/\s{2,}/g, ' ').trim().slice(0, 80);
}

function sanitizeEmail(input) {
  let s = normalizeUnicode(input).trim().toLowerCase();
  s = stripControls(s).replace(/[^a-z0-9._%+\-@]/g, '');
  const parts = s.split('@');
  if (parts.length > 2) s = parts.slice(0, 2).join('@');
  return s.slice(0, 254);
}

function sanitizePhone(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s).replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  s = s.replace(/^\+?0+/, m => m.startsWith('+') ? '+' : '');
  return s.slice(0, 16);
}

function sanitizeMessage(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s, { keepNewlines: true });
  s = s.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/--/g, '').replace(/;/g, '');
  s = s.replace(/['"`\\]/g, '').replace(/[{}$]/g, '').replace(/\bjavascript\s*:/gi, '');
  return s.replace(/[ \t]{2,}/g, ' ').trim().slice(0, 2000);
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPhone(phone)  { return /^\+?\d{8,15}$/.test(phone); }

function showError(inputElement, message) {
  inputElement.classList.add('error');
  showFormAlert('error', message);
}
function clearError(inputElement) { inputElement.classList.remove('error'); }

function showFormAlert(type, message) {
  const box = document.getElementById('formAlert');
  const msg = document.getElementById('formAlertMessage');
  if (!box || !msg) return;
  msg.textContent = message;
  box.className = `form-alert ${type}`;
  box.classList.remove('hidden');
  clearTimeout(showFormAlert._t);
  showFormAlert._t = setTimeout(hideFormAlert, 10000);
}

function hideFormAlert() {
  const box = document.getElementById('formAlert');
  if (box) box.classList.add('hidden');
}

class EmailService {
  constructor(serviceId, templateId, publicKey) {
    this.serviceId  = serviceId;
    this.templateId = templateId;
    if (publicKey) emailjs.init(publicKey);
  }
  async sendEmail({ name, email, phone, message }) {
    try {
      const response = await emailjs.send(this.serviceId, this.templateId, {
        name, email, phone, message,
        timestamp: new Date().toLocaleString('pt-BR'),
      });
      return { success: true, response };
    } catch (error) {
      return { success: false, error };
    }
  }
}

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (typeof emailjs !== 'undefined') { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = resolve;
    script.onerror = () => {
      const alt = document.createElement('script');
      alt.src = 'https://cdn.emailjs.com/dist/email.min.js';
      alt.onload = resolve;
      alt.onerror = () => reject(new Error('Falha ao carregar EmailJS'));
      document.head.appendChild(alt);
    };
    document.head.appendChild(script);
  });
}

let formDataTemp = null;

async function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput    = document.getElementById('nome');
  const emailInput   = document.getElementById('email');
  const phoneInput   = document.getElementById('tel');
  const messageInput = document.getElementById('msg');

  const name    = sanitizeName(nameInput.value);
  const email   = sanitizeEmail(emailInput.value);
  const phone   = sanitizePhone(phoneInput.value);
  const message = sanitizeMessage(messageInput.value);

  nameInput.value    = name;
  emailInput.value   = email;
  phoneInput.value   = phone;
  messageInput.value = message;

  let isValid = true;

  if (!name)                { showError(nameInput,    'O nome é obrigatório.');                              isValid = false; } else clearError(nameInput);
  if (!isValidEmail(email)) { showError(emailInput,   'Formato de e-mail inválido.');                        isValid = false; } else clearError(emailInput);
  if (!isValidPhone(phone)) { showError(phoneInput,   'Telefone deve ter 8 a 15 dígitos.');                  isValid = false; } else clearError(phoneInput);
  if (message.length < 5)   { showError(messageInput, 'A mensagem deve ter pelo menos 5 caracteres.');       isValid = false; } else clearError(messageInput);

  if (!isValid) return;

  formDataTemp = { name, email, phone, message, inputs: { nameInput, emailInput, phoneInput, messageInput } };
  openTermsModal();
}

function openTermsModal() {
  const termsModal    = document.getElementById('termsModal');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const confirmBtn    = document.getElementById('confirmTermsBtn');
  if (!termsModal) return;
  if (termsCheckbox) termsCheckbox.checked = false;
  if (confirmBtn)    confirmBtn.disabled   = true;
  termsModal.classList.add('is-active');
}

function closeTermsModal() {
  const termsModal = document.getElementById('termsModal');
  if (termsModal) termsModal.classList.remove('is-active');
  formDataTemp = null;
}

async function sendEmailAfterTerms() {
  if (!formDataTemp) {
    showFormAlert('error', 'Erro ao processar formulário. Tente novamente.');
    closeTermsModal();
    return;
  }

  const { name, email, phone, message, inputs } = formDataTemp;
  closeTermsModal();

  const emailService = new EmailService('service_yq8he0m', 'template_ciu2478', 'K2JLEx06aJ9iVaPlK');
  const result = await emailService.sendEmail({ name, email, phone, message });

  if (result.success) {
    inputs.nameInput.value = inputs.emailInput.value = inputs.phoneInput.value = inputs.messageInput.value = '';
    showFormAlert('success', 'Formulário enviado com sucesso!');
  } else {
    showFormAlert('error', 'Falha ao enviar mensagem. Tente novamente mais tarde.');
  }

  formDataTemp = null;
}
