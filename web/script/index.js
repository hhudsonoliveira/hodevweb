// =======================
// Entities + Builder
// =======================

class Project {
  constructor(title, description, image, link) {
    this.title = title
    this.description = description
    this.image = image
    this.link = link
  }
}

class ProjectBuilder {
  constructor() {
    this.title = ""
    this.description = ""
    this.image = ""
    this.link = "#"
  }
  setTitle(title) {
    this.title = title
    return this
  }
  setDescription(description) {
    this.description = description
    return this
  }
  setImage(image) {
    this.image = image
    return this
  }
  setLink(link) {
    this.link = link
    return this
  }
  build() {
    return new Project(this.title, this.description, this.image, this.link)
  }
}

// =======================
// Modal Controller
// =======================

class ProjectsModal {
  constructor(modalId, openBtnId, closeBtnId, projectsContainerId) {
    this.modal = document.getElementById(modalId)
    this.openBtn = document.getElementById(openBtnId)
    this.closeBtn = document.getElementById(closeBtnId)
    this.overlay = this.modal.querySelector(".modal__overlay")
    this.container = document.getElementById(projectsContainerId)

    this.initEvents()
  }

  initEvents() {
    this.openBtn.addEventListener("click", () => this.open())
    this.closeBtn.addEventListener("click", () => this.close())
    this.overlay.addEventListener("click", () => this.close())
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close()
    })
  }

  open() {
    this.modal.classList.add("is-active")
  }

  close() {
    this.modal.classList.remove("is-active")
  }

  renderProjects(projects) {
    this.container.innerHTML = ""
    projects.forEach((p) => {
      const card = document.createElement("div")
      card.className = "project-card"
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank" rel="noopener noreferrer">Acessar</a>
      `
      this.container.appendChild(card)
    })
  }
}


// =======================
// Inicialização
// =======================

// ======================================================
// Quando criar os projetos descomente o código abaixo
// ======================================================

// document.addEventListener("DOMContentLoaded", () => {
//   const projects = [
//     new ProjectBuilder()
//       .setTitle("Website Responsivo")
//       .setDescription("Criação de site moderno e adaptável.")
//       .setImage("./assets/projeto1.png")
//       .setLink("https://meusite1.com")
//       .build(),
//     new ProjectBuilder()
//       .setTitle("Landing Page")
//       .setDescription("Página de alta conversão para captação de clientes.")
//       .setImage("./assets/projeto2.png")
//       .setLink("https://meusite2.com")
//       .build(),
//     new ProjectBuilder()
//       .setTitle("Automação com n8n")
//       .setDescription("Fluxos automatizados para otimizar processos.")
//       .setImage("./assets/projeto3.png")
//       .setLink("https://meusite3.com")
//       .build(),
//   ]

//   const modal = new ProjectsModal(
//     "projectsModal",
//     "openProjectsBtn",
//     "closeModalBtn",
//     "projectsContainer"
//   )

//   modal.renderProjects(projects)
// })

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
  // remove ASCII controls; mantém \n e \t se solicitado
  const re = keepNewlines
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g;
  return str.replace(re, "");
}

// ============================
// Sanitizers (SRP: one per field)
// ============================

// Nome: apenas letras (com acentos), espaços, hífen e apóstrofo
function sanitizeName(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s);
  s = s.replace(/[^\p{L}\s'-]/gu, ""); // allowlist
  s = s.replace(/\s{2,}/g, " ").trim();
  return s.slice(0, 80);
}

// Email: remove espaços e caracteres inválidos, normaliza minúsculas
function sanitizeEmail(input) {
  let s = normalizeUnicode(input).trim().toLowerCase();
  s = stripControls(s);
  s = s.replace(/[^a-z0-9._%+\-@]/g, ""); // allowlist
  // garante no máx. um '@'
  const parts = s.split("@");
  if (parts.length > 2) s = parts.slice(0, 2).join("@");
  return s.slice(0, 254);
}

// Telefone: mantém dígitos e um '+' no início
function sanitizePhone(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s);
  s = s.replace(/[^\d+]/g, "");      // remove tudo que não é dígito ou '+'
  s = s.replace(/(?!^)\+/g, "");     // remove '+' que não seja o primeiro
  s = s.replace(/^\+?0+/, (m) => (m.startsWith("+") ? "+" : "")); // remove zeros à esquerda
  return s.slice(0, 16);
}

// Mensagem: forte contra XSS / tokens comuns de SQLi
function sanitizeMessage(input) {
  let s = normalizeUnicode(input);
  s = stripControls(s, { keepNewlines: true });

  // remove tags HTML e ângulos
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/[<>]/g, "");

  // remove comentários e terminadores comuns
  s = s.replace(/\/\*[\s\S]*?\*\//g, ""); // /* ... */
  s = s.replace(/--/g, "");               // --
  s = s.replace(/;/g, "");                // ;

  // remove aspas/backticks/backslash, chaves e $
  s = s.replace(/['"`\\]/g, "");
  s = s.replace(/[{}$]/g, "");

  // remove "javascript:" (evita payloads de URL)
  s = s.replace(/\bjavascript\s*:/gi, "");

  // colapsa espaços
  s = s.replace(/[ \t]{2,}/g, " ").trim();

  return s.slice(0, 2000);
}

// Fallback (não usado diretamente, mantido por compatibilidade)
function sanitizeInput(input) {
  return sanitizeMessage(input);
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
  const regex = /^\+?\d{8,15}$/; // Aceita formatos internacionais
  return regex.test(phone);
}

function isValidMessage(message) {
  return message.length >= 5; // mínimo de 5 caracteres
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

  alertMessage.textContent = message; // evita XSS
  alertBox.className = `form-alert ${type}`;
  alertBox.classList.remove("hidden");

  // Fecha automaticamente após 10s
  window.clearTimeout(showFormAlert._t);
  showFormAlert._t = window.setTimeout(hideFormAlert, 10000);
}

function hideFormAlert() {
  const alertBox = document.getElementById("formAlert");
  if (alertBox) alertBox.classList.add("hidden");
}

function clearFormFields(nameInput, emailInput, phoneInput, messageInput) {
  nameInput.value = ""
  emailInput.value = ""
  phoneInput.value = ""
  messageInput.value = ""
}

// Botão fechar (protege se elemento não existir)
const alertCloseBtn = document.getElementById("formAlertClose");
if (alertCloseBtn) alertCloseBtn.addEventListener("click", hideFormAlert);

// ============================
// Form Handler
// ============================
function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("tel");
  const messageInput = document.getElementById("msg");

  // Sanitização por campo (e escreve de volta nos inputs)
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
  } else {
    clearError(nameInput);
  }

  if (!isValidEmail(email)) {
    showError(emailInput, "Formato de e-mail inválido.");
    isValid = false;
  } else {
    clearError(emailInput);
  }

  if (!isValidPhone(phone)) {
    showError(phoneInput, "O telefone deve conter apenas números (8 a 15 dígitos).");
    isValid = false;
  } else {
    clearError(phoneInput);
  }

  if (!isValidMessage(message)) {
    showError(messageInput, "A mensagem deve ter pelo menos 5 caracteres.");
    isValid = false;
  } else {
    clearError(messageInput);
  }

  if (isValid) {
    // Dados limpos prontos para envio ao servidor (que deve usar prepared statements)
    console.log("Form submitted:", { name, email, phone, message });
    clearFormFields(nameInput, emailInput, phoneInput, messageInput)
    showFormAlert("success", "Formulário enviado com sucesso!");
    event.target.reset();
  }
}

// ============================
// Init
// ============================
document.getElementById("send").addEventListener("click", handleFormSubmit);




// FALTA ALGUMAS CONFIGS E TESTAR

// ============================
// Service: EmailService
// Responsável apenas por enviar emails via EmailJS
// ============================
class EmailService {
  constructor(serviceId, templateId, publicKey) {
    this.serviceId = serviceId;
    this.templateId = templateId;
    emailjs.init({ publicKey });
  }

  async send(formElement) {
    try {
      return await emailjs.sendForm(this.serviceId, this.templateId, formElement);
    } catch (error) {
      throw new Error("Erro ao enviar email: " + error.text);
    }
  }
}

// ============================
// Handler: FormHandler
// Responsável por gerenciar o formulário
// ============================
class FormHandler {
  constructor(formId, emailService) {
    this.form = document.getElementById(formId);
    this.emailService = emailService;
  }

  initialize() {
    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.handleSubmit();
    });
  }

  async handleSubmit() {
    try {
      await this.emailService.send(this.form);
      alert("Mensagem enviada com sucesso! ✅");
      this.form.reset();
    } catch (error) {
      console.error(error);
      alert("Falha ao enviar a mensagem ❌");
    }
  }
}

// ============================
// App Initialization
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const emailService = new EmailService(
    "service_yq8he0m",   // service_id
    "template_ciu2478", // template_id
    "K2JLEx06aJ9iVaPlK" // substitua pela sua publicKey do EmailJS
  );

  const formHandler = new FormHandler("contact-form", emailService);
  formHandler.initialize();
});


