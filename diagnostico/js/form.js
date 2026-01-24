/* =====================================================
   HO DEVWEB - DIAGNÓSTICO EMPRESARIAL PREMIUM
   JavaScript Moderno com Animações
   ===================================================== */

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================

const FormState = {
  currentStep: 1,
  totalSteps: 17,
  data: {},
  isAnimating: false,
  startTime: null
};

// ============================================
// ELEMENTOS DO DOM
// ============================================

const DOM = {
  progressBar: null,
  progressText: null,
  container: null,
  form: null
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeDOM();
  initializeForm();
  setupEventListeners();
  showStep(1);
  FormState.startTime = Date.now();
});

function initializeDOM() {
  DOM.progressBar = document.getElementById('progress-bar');
  DOM.progressText = document.getElementById('progress-text');
  DOM.container = document.querySelector('.container');
  DOM.form = document.getElementById('diagnostico-form');
}

function initializeForm() {
  updateProgress();

  // Esconde intro após mostrar primeira pergunta
  const intro = document.querySelector('.diagnostic-intro');
  if (intro) {
    intro.style.display = 'block';
  }
}

// ============================================
// NAVEGAÇÃO ENTRE STEPS
// ============================================

function nextStep() {
  if (FormState.isAnimating) return;

  if (!validateCurrentStep()) {
    shakeCard();
    return;
  }

  saveStepData();

  if (FormState.currentStep < FormState.totalSteps) {
    FormState.isAnimating = true;

    // Esconde intro na primeira navegação
    if (FormState.currentStep === 1) {
      hideIntro();
    }

    hideCurrentStep(() => {
      FormState.currentStep++;
      showStep(FormState.currentStep);
      updateProgress();

      setTimeout(() => {
        FormState.isAnimating = false;
      }, 400);
    });
  } else {
    submitForm();
  }
}

function prevStep() {
  if (FormState.isAnimating || FormState.currentStep <= 1) return;

  FormState.isAnimating = true;

  hideCurrentStep(() => {
    FormState.currentStep--;
    showStep(FormState.currentStep);
    updateProgress();

    setTimeout(() => {
      FormState.isAnimating = false;
    }, 400);
  }, 'prev');
}

function showStep(stepNumber) {
  const step = document.querySelector(`.step-${stepNumber}`);
  if (!step) return;

  // Remove active de todos
  document.querySelectorAll('.step').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  // Mostra step atual
  step.style.display = 'block';

  // Força reflow para animação
  void step.offsetWidth;

  step.classList.add('active');

  // Auto-focus com delay
  setTimeout(() => {
    const input = step.querySelector('input, textarea');
    if (input) {
      input.focus();
    }
  }, 300);

  // Scroll suave para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideCurrentStep(callback, direction = 'next') {
  const step = document.querySelector(`.step-${FormState.currentStep}`);
  if (!step) {
    if (callback) callback();
    return;
  }

  step.style.opacity = '0';
  step.style.transform = direction === 'next' ? 'translateY(-30px)' : 'translateY(30px)';

  setTimeout(() => {
    step.style.display = 'none';
    step.classList.remove('active');
    step.style.opacity = '';
    step.style.transform = '';
    if (callback) callback();
  }, 300);
}

function hideIntro() {
  const intro = document.querySelector('.diagnostic-intro');
  if (intro) {
    intro.style.opacity = '0';
    intro.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      intro.style.display = 'none';
    }, 300);
  }
}

// ============================================
// BARRA DE PROGRESSO
// ============================================

function updateProgress() {
  const percentage = (FormState.currentStep / FormState.totalSteps) * 100;

  if (DOM.progressBar) {
    DOM.progressBar.style.width = percentage + '%';
  }

  if (DOM.progressText) {
    DOM.progressText.textContent = `${FormState.currentStep} de ${FormState.totalSteps}`;
  }
}

// ============================================
// VALIDAÇÕES
// ============================================

function validateCurrentStep() {
  const step = document.querySelector(`.step-${FormState.currentStep}`);
  if (!step) return true;

  clearErrors();

  // Valida inputs de texto
  const input = step.querySelector('input:not([type="checkbox"]), textarea');
  if (input && input.hasAttribute('required')) {
    if (!input.value.trim()) {
      showError('Por favor, preencha este campo');
      input.classList.add('error');
      return false;
    }

    // Validação de email
    if (input.type === 'email' && !isValidEmail(input.value)) {
      showError('Por favor, insira um e-mail válido');
      input.classList.add('error');
      return false;
    }

    // Validação de telefone
    if (input.type === 'tel') {
      const phoneDigits = input.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        showError('Telefone inválido. Use: (71) 99999-9999');
        input.classList.add('error');
        return false;
      }
    }

    // Validação de URL
    if (input.type === 'url' && input.value && !isValidURL(input.value)) {
      showError('URL inválida. Ex: https://site.com.br');
      input.classList.add('error');
      return false;
    }
  }

  // Valida option cards (seleção única)
  const optionCards = step.querySelectorAll('.option-card');
  if (optionCards.length > 0) {
    const selected = step.querySelector('.option-card.selected');
    if (!selected) {
      showError('Selecione uma opção');
      return false;
    }
  }

  // Valida checkbox cards (múltipla escolha)
  const checkboxCards = step.querySelectorAll('.checkbox-card input');
  if (checkboxCards.length > 0) {
    const checked = step.querySelectorAll('.checkbox-card input:checked');
    if (checked.length === 0) {
      showError('Selecione pelo menos uma opção');
      return false;
    }
  }

  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidURL(url) {
  try {
    // Adiciona protocolo se não tiver
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// MENSAGENS DE ERRO
// ============================================

function showError(message) {
  const step = document.querySelector(`.step-${FormState.currentStep}`);
  if (!step) return;

  let errorDiv = step.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    const questionCard = step.querySelector('.question-card');
    if (questionCard) {
      questionCard.appendChild(errorDiv);
    }
  }

  errorDiv.textContent = message;
  errorDiv.classList.add('show');
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.remove('show');
  });

  document.querySelectorAll('.glass-input.error').forEach(el => {
    el.classList.remove('error');
  });
}

function shakeCard() {
  const card = document.querySelector(`.step-${FormState.currentStep} .question-card`);
  if (card) {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'shake 0.4s ease';
  }
}

// ============================================
// SALVAR DADOS
// ============================================

function saveStepData() {
  const step = document.querySelector(`.step-${FormState.currentStep}`);
  if (!step) return;

  // Salva inputs de texto
  const input = step.querySelector('input:not([type="checkbox"]), textarea');
  if (input && input.value) {
    const fieldName = input.name || input.id || `step_${FormState.currentStep}`;
    FormState.data[fieldName] = input.value;
  }

  // Salva option cards selecionados
  const selectedCard = step.querySelector('.option-card.selected');
  if (selectedCard) {
    const fieldName = selectedCard.closest('[data-field]')?.dataset.field || `step_${FormState.currentStep}`;
    FormState.data[fieldName] = selectedCard.dataset.value;
  }

  // Salva checkboxes
  const checkedBoxes = step.querySelectorAll('.checkbox-card input:checked');
  if (checkedBoxes.length > 0) {
    const fieldName = checkedBoxes[0].name || `step_${FormState.currentStep}`;
    FormState.data[fieldName] = Array.from(checkedBoxes).map(cb => cb.value);
  }

  // Salva no localStorage
  localStorage.setItem('hodevweb_diagnostic', JSON.stringify(FormState.data));
  localStorage.setItem('hodevweb_step', FormState.currentStep.toString());

  console.log('Dados salvos:', FormState.data);
}

// ============================================
// OPTION CARDS (Seleção única)
// ============================================

function setupOptionCards() {
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function () {
      // Remove seleção dos outros cards no mesmo grupo
      const parent = this.closest('.option-cards');
      if (parent) {
        parent.querySelectorAll('.option-card').forEach(c => {
          c.classList.remove('selected');
        });
      }

      // Seleciona este card
      this.classList.add('selected');

      // Limpa erro se houver
      clearErrors();

      // Auto-avança após pequeno delay (opcional)
      setTimeout(() => {
        nextStep();
      }, 400);
    });
  });
}

// ============================================
// MÁSCARAS
// ============================================

function applyPhoneMask(input) {
  let value = input.value.replace(/\D/g, '');

  if (value.length <= 11) {
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d{0,2})/, '($1');
    }
  }

  input.value = value;
}

// ============================================
// QUICK SUGGESTIONS (Pills)
// ============================================

function setupSuggestionPills() {
  document.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      const textarea = this.closest('.question-card').querySelector('textarea');
      if (textarea) {
        // Adiciona texto ao textarea
        const text = this.textContent.replace(/^[^\w]+/, '').trim();
        if (textarea.value) {
          textarea.value += ', ' + text;
        } else {
          textarea.value = text;
        }

        // Marca pill como ativa
        this.classList.toggle('active');

        // Focus no textarea
        textarea.focus();
      }
    });
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Enter para avançar (exceto em textareas)
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      nextStep();
    }
  });

  // Ctrl+Enter em textareas para avançar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && e.target.tagName === 'TEXTAREA') {
      e.preventDefault();
      nextStep();
    }
  });

  // Máscara de telefone
  document.addEventListener('input', (e) => {
    if (e.target.type === 'tel') {
      applyPhoneMask(e.target);
    }

    // Limpa erro ao digitar
    if (e.target.classList.contains('glass-input')) {
      e.target.classList.remove('error');
      clearErrors();
    }
  });

  // Validação em tempo real para email
  document.addEventListener('blur', (e) => {
    if (e.target.type === 'email' && e.target.value) {
      if (isValidEmail(e.target.value)) {
        e.target.classList.add('valid');
        e.target.classList.remove('error');
      } else {
        e.target.classList.remove('valid');
      }
    }
  }, true);

  // Setup option cards
  setupOptionCards();

  // Setup suggestion pills
  setupSuggestionPills();

  // Checkbox cards - limpa erro ao selecionar
  document.querySelectorAll('.checkbox-card input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      clearErrors();
    });
  });
}

// ============================================
// ENVIO DO FORMULÁRIO
// ============================================

function submitForm() {
  // Salva última etapa
  saveStepData();

  // Calcula tempo gasto
  const timeSpent = Math.round((Date.now() - FormState.startTime) / 1000);
  FormState.data.timeSpent = timeSpent;
  FormState.data.submittedAt = new Date().toISOString();

  console.log('=== DADOS DO FORMULÁRIO ===');
  console.log(FormState.data);
  console.log('Tempo gasto:', timeSpent, 'segundos');
  console.log('===========================');

  // Mostra loading no botão
  const btn = document.querySelector(`.step-${FormState.currentStep} .btn-continue`);
  if (btn) {
    btn.classList.add('loading');
    const btnText = btn.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Enviando...';
  }

  // Salva dados finais
  localStorage.setItem('hodevweb_diagnostic_final', JSON.stringify(FormState.data));

  // Simula envio e redireciona
  setTimeout(() => {
    window.location.href = 'obrigado.html';
  }, 1500);
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

function goToStep(step) {
  if (step >= 1 && step <= FormState.totalSteps) {
    hideCurrentStep(() => {
      FormState.currentStep = step;
      showStep(step);
      updateProgress();
    });
  }
}

// Recupera progresso salvo (opcional)
function loadSavedProgress() {
  const savedData = localStorage.getItem('hodevweb_diagnostic');
  const savedStep = localStorage.getItem('hodevweb_step');

  if (savedData) {
    try {
      FormState.data = JSON.parse(savedData);
    } catch (e) {
      console.error('Erro ao carregar dados salvos:', e);
    }
  }

  // Opcional: perguntar se quer continuar de onde parou
  if (savedStep && parseInt(savedStep) > 1) {
    const continueFromSaved = confirm(`Você parou na pergunta ${savedStep}. Deseja continuar de onde parou?`);
    if (continueFromSaved) {
      FormState.currentStep = parseInt(savedStep);
    }
  }
}

// Limpa dados salvos
function clearSavedProgress() {
  localStorage.removeItem('hodevweb_diagnostic');
  localStorage.removeItem('hodevweb_step');
  FormState.data = {};
  FormState.currentStep = 1;
}
