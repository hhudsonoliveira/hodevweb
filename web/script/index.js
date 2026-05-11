/*
  ============================================================================
  HODEVWEB - Contact Form Handler with Security Features
  ============================================================================
*/


/*
  SECURITY NOTES (XSS & SQLi hardening – client side)
  ---------------------------------------------------
  - Field-specific sanitizers (SRP) with allowlists:
      * Name: only letters (incl. accents), spaces, hyphen, apostrophe.
      * Email: remove chars fora de [a-z0-9._%+-@] e normaliza para minúsculas.
      * Phone: mantém dígitos e um único '+' no início; remove demais.
     / * Message: remove tags HTML, tokens de comentário (/* */ //, --),
/*terminadores (';'), aspas/backticks, chaves {}, backslash, 
sequence "javascript:" e normaliza espaços.
- Unicode NFKC normalization: mitiga homógrafos/compatibility forms.
- Remove control chars (exceto \n e \t na mensagem).
- Limites de tamanho (DoS/payloads grandes).
- Mensagens na UI usam textContent (não innerHTML) para evitar XSS.
- IMPORTANTE: prevenção real de SQL Injection deve ser feita no BACK-END
com consultas parametrizadas/ORM. Este código apenas "higieniza" o input
para reduzir risco antes do envio.
*/

// ============================
// Utils: Normalization & Escaping
// ============================
function normalizeUnicode(str) {
  return (str ?? "").normalize("NFKC");
}

function stripControls(str, { keepNewlines = false } = {}) {
  const re = keepNewlines
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g;
  return str.replace(re, "");
}

// ============================
// Sanitizers (SRP: one per field)
// ============================

function sanitizeName(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s);
  s = s.replace(/[^\p{L}\s'-]/gu, "");
  s = s.replace(/\s{2,}/g, " ").trim();
  return s.slice(0, 80);
}

function sanitizeEmail(input) {
  let s = normalizeUnicode(input).trim().toLowerCase();
  s = stripControls(s);
  s = s.replace(/[^a-z0-9._%+\-@]/g, "");
  const parts = s.split("@");
  if (parts.length > 2) s = parts.slice(0, 2).join("@");
  return s.slice(0, 254);
}

function sanitizePhone(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s);
  s = s.replace(/[^\d+]/g, "");
  s = s.replace(/(?!^)\+/g, "");
  s = s.replace(/^\+?0+/, (m) => (m.startsWith("+") ? "+" : ""));
  return s.slice(0, 16);
}

function sanitizeMessage(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s, { keepNewlines: true });
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/[<>]/g, "");
  s = s.replace(/\/\*[\s\S]*?\*\//g, "");
  s = s.replace(/--/g, "");
  s = s.replace(/;/g, "");
  s = s.replace(/['"`\\]/g, "");
  s = s.replace(/[{}$]/g, "");
  s = s.replace(/\bjavascript\s*:/gi, "");
  s = s.replace(/[ \t]{2,}/g, " ").trim();
  return s.slice(0, 2000);
}

// ============================
// Validators (SRP - one task each)
// ============================
function isNotEmpty(value) {
  return value.length > 0;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  const regex = /^\+?\d{8,15}$/;
  return regex.test(phone);
}

function isValidMessage(message) {
  return message.length >= 5;
}

// ============================
// Error + Alert Handling
// ============================
function showError(inputElement, message) {
  inputElement.classList.add("error");
  showFormAlert("error", message);
}

function clearError(inputElement) {
  inputElement.classList.remove("error");
}

function showFormAlert(type, message) {
  const alertBox = document.getElementById("formAlert");
  const alertMessage = document.getElementById("formAlertMessage");
  if (!alertBox || !alertMessage) return;

  alertMessage.textContent = message;
  alertBox.className = `form-alert ${type}`;
  alertBox.classList.remove("hidden");

  window.clearTimeout(showFormAlert._t);
  showFormAlert._t = window.setTimeout(hideFormAlert, 10000);
}

function hideFormAlert() {
  const alertBox = document.getElementById("formAlert");
  if (alertBox) alertBox.classList.add("hidden");
}

function clearFormFields(nameInput, emailInput, phoneInput, messageInput) {
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  messageInput.value = "";
}

// ============================
// Email Service (SRP: só envia email)
// ============================
class EmailService {
  constructor(serviceId, templateId, publicKey) {
    this.serviceId = serviceId;
    this.templateId = templateId;
    this.publicKey = publicKey;

    // Initialize EmailJS only if credentials are provided
    if (this.publicKey) {
      emailjs.init(this.publicKey);
    }
  }

  async sendEmail({ name, email, phone, message }) {
    const templateParams = {
      name,
      email,
      phone: phone,
      timestamp: new Date().toLocaleString("pt-BR"),
      message: message,
    };

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );
      return { success: true, response };
    } catch (error) {
      // Log error for debugging
      console.error("Erro ao enviar email:", error);
      return { success: false, error };
    }
  }
}

// ============================
// Alternative: API Backend Service (Recommended for production)
// ============================
class BackendEmailService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl || '/api';
  }

  async sendEmail({ name, email, phone, message }) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao enviar email via backend:", error);
      return { success: false, error };
    }
  }
}

// ============================
// Global variable to store form data temporarily
// ============================
let formDataTemp = null;

// ============================
// Form Handler (SRP: valida + abre modal de termos)
// ============================
async function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("tel");
  const messageInput = document.getElementById("msg");

  const name = sanitizeName(nameInput.value);
  const email = sanitizeEmail(emailInput.value);
  const phone = sanitizePhone(phoneInput.value);
  const message = sanitizeMessage(messageInput.value);

  nameInput.value = name;
  emailInput.value = email;
  phoneInput.value = phone;
  messageInput.value = message;

  let isValid = true;

  if (!isNotEmpty(name)) {
    showError(nameInput, "O nome é obrigatório.");
    isValid = false;
  } else clearError(nameInput);

  if (!isValidEmail(email)) {
    showError(emailInput, "Formato de e-mail inválido.");
    isValid = false;
  } else clearError(emailInput);

  if (!isValidPhone(phone)) {
    showError(
      phoneInput,
      "O telefone deve conter apenas números (8 a 15 dígitos)."
    );
    isValid = false;
  } else clearError(phoneInput);

  if (!isValidMessage(message)) {
    showError(messageInput, "A mensagem deve ter pelo menos 5 caracteres.");
    isValid = false;
  } else clearError(messageInput);

  if (!isValid) return;

  // Store validated data temporarily
  formDataTemp = {
    name,
    email,
    phone,
    message,
    inputs: { nameInput, emailInput, phoneInput, messageInput }
  };

  // Open terms modal instead of sending email directly
  openTermsModal();
}

// ============================
// Terms Modal Functions
// ============================
function openTermsModal() {
  const termsModal = document.getElementById("termsModal");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const confirmBtn = document.getElementById("confirmTermsBtn");

  if (!termsModal) {
    console.error("Modal de termos não encontrado");
    return;
  }

  // Reset checkbox and button state
  if (termsCheckbox) termsCheckbox.checked = false;
  if (confirmBtn) confirmBtn.disabled = true;

  // Show modal
  termsModal.classList.add("is-active");
}

function closeTermsModal() {
  const termsModal = document.getElementById("termsModal");
  if (termsModal) {
    termsModal.classList.remove("is-active");
  }
  // Clear temporary data
  formDataTemp = null;
}

// ============================
// Send Email After Terms Acceptance
// ============================
async function sendEmailAfterTerms() {
  if (!formDataTemp) {
    console.error("Dados do formulário não encontrados");
    showFormAlert("error", "Erro ao processar formulário. Tente novamente.");
    closeTermsModal();
    return;
  }

  // IMPORTANT: Get data BEFORE closing modal (closeTermsModal clears formDataTemp)
  const { name, email, phone, message, inputs } = formDataTemp;

  // Close terms modal
  closeTermsModal();

  // ============================
  // SECURITY: Use environment variables
  // ============================
  const USE_BACKEND = false; // Set to true to use backend API (RECOMMENDED)

  let emailService;

  if (USE_BACKEND) {
    // RECOMMENDED: Use backend API to hide credentials
    emailService = new BackendEmailService('/api');
  } else {
    // FALLBACK: Direct EmailJS (only for development/testing)
    // Using direct values since process.env doesn't work in browser
    emailService = new EmailService(
      "service_yq8he0m",
      "template_ciu2478",
      "K2JLEx06aJ9iVaPlK"
    );
  }

  const result = await emailService.sendEmail({
    name,
    email,
    phone,
    message,
  });

  // Log result for debugging
  console.log("Email send result:", result);

  if (result.success) {
    clearFormFields(
      inputs.nameInput,
      inputs.emailInput,
      inputs.phoneInput,
      inputs.messageInput
    );
    showFormAlert("success", "Formulário enviado com sucesso!");
  } else {
    showFormAlert(
      "error",
      "Falha ao enviar mensagem. Tente novamente mais tarde."
    );
  }

  // Clear temporary data
  formDataTemp = null;
}

// ============================
// Clients Carousel (auto-scroll + arrow nav)
// ============================
function initClientsCarousel() {
  const track   = document.querySelector('.clients-track');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');

  if (!track) return;

  const DURATION_MS = 32000; // must match CSS (32s)
  const CARD_STEP   = 364;   // 340px card + 24px gap

  function navigate(direction) {
    const anim = track.getAnimations()[0];
    if (!anim) return;

    const half      = track.scrollWidth / 2 || 1080;
    const curPx     = (anim.currentTime % DURATION_MS) / DURATION_MS * half;
    const targetPx  = ((curPx + direction * CARD_STEP) % half + half) % half;

    anim.currentTime = targetPx / half * DURATION_MS;
  }

  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(+1));
}

// ============================
// Mobile Menu Toggle with Animation
// ============================
function initMobileMenu() {
  const navToggle   = document.querySelector(".nav__toggle");
  const navList     = document.querySelector(".nav__list");
  const navLinks    = document.querySelectorAll(".nav__link");
  const backdrop    = document.querySelector(".nav__backdrop");
  const drawerClose = document.querySelector(".nav__drawer-close");

  if (!navToggle || !navList) return;

  function openMenu() {
    navToggle.classList.add("active");
    navList.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    if (backdrop) { backdrop.style.opacity = "1"; backdrop.style.pointerEvents = "auto"; }
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navToggle.classList.remove("active");
    navList.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    if (backdrop) { backdrop.style.opacity = ""; backdrop.style.pointerEvents = ""; }
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navList.classList.contains("active") ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  if (backdrop)    backdrop.addEventListener("click", closeMenu);
  if (drawerClose) drawerClose.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
}

// ============================
// EmailJS Dynamic Loader
// ============================
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    // Check if EmailJS is already loaded
    if (typeof emailjs !== 'undefined') {
      console.log('EmailJS já está carregado');
      resolve();
      return;
    }

    console.log('Carregando EmailJS dinamicamente...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      console.log('EmailJS carregado com sucesso!');
      resolve();
    };
    script.onerror = () => {
      console.error('Erro ao carregar EmailJS via jsdelivr, tentando CDN alternativo...');
      // Try alternative CDN
      const altScript = document.createElement('script');
      altScript.src = 'https://cdn.emailjs.com/dist/email.min.js';
      altScript.onload = () => {
        console.log('EmailJS carregado via CDN alternativo!');
        resolve();
      };
      altScript.onerror = () => reject(new Error('Falha ao carregar EmailJS'));
      document.head.appendChild(altScript);
    };
    document.head.appendChild(script);
  });
}

// ============================
// Init - Wrap event listeners in DOMContentLoaded for safety
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize UI immediately — independent of EmailJS
  initMobileMenu();
  initClientsCarousel();

  // Load EmailJS (form only — doesn't block UI)
  try {
    await loadEmailJS();
  } catch (error) {
    console.error('Erro crítico ao carregar EmailJS:', error);
    showFormAlert('error', 'Erro ao carregar sistema de email. Recarregue a página.');
    return;
  }

  // Form submit handler
  const sendButton = document.getElementById("send");
  if (sendButton) {
    sendButton.addEventListener("click", handleFormSubmit);
  }

  // Alert close button handler
  const alertCloseBtn = document.getElementById("formAlertClose");
  if (alertCloseBtn) {
    alertCloseBtn.addEventListener("click", hideFormAlert);
  }

  // ============================
  // Terms Modal Event Listeners
  // ============================
  const termsModal = document.getElementById("termsModal");
  const closeTermsBtn = document.getElementById("closeTermsBtn");
  const termsOverlay = termsModal?.querySelector(".modal__overlay");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const confirmTermsBtn = document.getElementById("confirmTermsBtn");

  // Close button
  if (closeTermsBtn) {
    closeTermsBtn.addEventListener("click", closeTermsModal);
  }

  // Overlay click to close
  if (termsOverlay) {
    termsOverlay.addEventListener("click", closeTermsModal);
  }

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && termsModal?.classList.contains("is-active")) {
      closeTermsModal();
    }
  });

  // Checkbox to enable/disable confirm button
  if (termsCheckbox && confirmTermsBtn) {
    termsCheckbox.addEventListener("change", () => {
      confirmTermsBtn.disabled = !termsCheckbox.checked;
    });
  }

  // Confirm button to send email
  if (confirmTermsBtn) {
    confirmTermsBtn.addEventListener("click", sendEmailAfterTerms);
  }

});
