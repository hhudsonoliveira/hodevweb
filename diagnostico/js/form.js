/* =====================================================
   HO DEVWEB - DIAGNÓSTICO EMPRESARIAL PREMIUM
   JavaScript Moderno com Animações
   Versão corrigida - Todos os campos tratados
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

    // Validação de URL (opcional - não obrigatório)
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

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
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
    FormState.data[fieldName] = input.value.trim();
  }

  // Salva option cards selecionados
  const selectedCard = step.querySelector('.option-card.selected');
  if (selectedCard) {
    const fieldName = selectedCard.closest('[data-field]')?.dataset.field || `step_${FormState.currentStep}`;
    FormState.data[fieldName] = selectedCard.dataset.value || selectedCard.textContent.trim();
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

      // Auto-avança após pequeno delay
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
// ANIMAÇÕES DE LOADING E FEEDBACK
// ============================================

function showLoadingAnimation() {
  // Cria overlay de loading
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Enviando seus dados...</p>
    </div>
  `;

  // Estilos inline
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 14, 39, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  `;

  const spinnerStyles = document.createElement('style');
  spinnerStyles.textContent = `
    .loading-spinner {
      text-align: center;
      color: #fff;
    }
    .loading-spinner .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(0, 102, 255, 0.2);
      border-top-color: #0066FF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    .loading-spinner p {
      font-size: 1.2rem;
      color: #00D4FF;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  document.head.appendChild(spinnerStyles);
  document.body.appendChild(overlay);
}

function hideLoadingAnimation() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function showSuccessAnimation() {
  const overlay = document.createElement('div');
  overlay.id = 'success-overlay';
  overlay.innerHTML = `
    <div class="success-content">
      <div class="success-icon">✓</div>
      <h2>Dados Enviados!</h2>
      <p>Redirecionando...</p>
    </div>
  `;

  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 14, 39, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  `;

  const successStyles = document.createElement('style');
  successStyles.textContent = `
    .success-content {
      text-align: center;
      color: #fff;
    }
    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00D4FF, #0066FF);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      margin: 0 auto 20px;
      animation: scaleIn 0.5s ease;
    }
    .success-content h2 {
      font-size: 2rem;
      margin-bottom: 10px;
      color: #00D4FF;
    }
    .success-content p {
      color: rgba(255,255,255,0.7);
    }
    @keyframes scaleIn {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
  `;

  document.head.appendChild(successStyles);
  document.body.appendChild(overlay);
}

function showErrorModal(message) {
  const overlay = document.createElement('div');
  overlay.id = 'error-overlay';
  overlay.innerHTML = `
    <div class="error-modal">
      <div class="error-icon">!</div>
      <h2>Ops! Algo deu errado</h2>
      <p>${message}</p>
      <div class="error-buttons">
        <button onclick="retrySubmit()" class="btn-retry">Tentar Novamente</button>
        <button onclick="closeErrorModal()" class="btn-close">Fechar</button>
      </div>
    </div>
  `;

  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 14, 39, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  `;

  const errorStyles = document.createElement('style');
  errorStyles.textContent = `
    .error-modal {
      text-align: center;
      color: #fff;
      padding: 40px;
      max-width: 400px;
    }
    .error-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #ff4444, #ff6666);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      margin: 0 auto 20px;
    }
    .error-modal h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #ff6666;
    }
    .error-modal p {
      color: rgba(255,255,255,0.7);
      margin-bottom: 20px;
    }
    .error-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .btn-retry, .btn-close {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .btn-retry {
      background: linear-gradient(135deg, #0066FF, #00D4FF);
      color: #fff;
    }
    .btn-close {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn-retry:hover, .btn-close:hover {
      transform: translateY(-2px);
    }
  `;

  document.head.appendChild(errorStyles);
  document.body.appendChild(overlay);
}

function closeErrorModal() {
  const overlay = document.getElementById('error-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function retrySubmit() {
  closeErrorModal();
  submitForm();
}

// ============================================
// ENVIO DO FORMULÁRIO
// ============================================

async function submitForm() {
  // Salva última etapa
  saveStepData();

  // Mostra loading
  showLoadingAnimation();

  // URL do webhook n8n
  const webhookURL = 'https://hudson-n8n-n8n-webhook.ibb2hf.easypanel.host/webhook/diagnostico-hodevweb';

  // Monta payload com todos os campos tratados
  const payload = {
    // Dados pessoais
    nome: FormState.data.nome || 'Não informado',
    email: FormState.data.email || 'Não informado',
    whatsapp: FormState.data.whatsapp || 'Não informado',

    // Dados da empresa
    empresa: FormState.data.empresa || 'Não informado',
    site: FormState.data.site || 'Não informado',
    funcionarios: FormState.data.funcionarios || 'Não informado',
    contatos_dia: FormState.data.contatos_dia || 'Não informado',

    // Objetivos
    objetivo: FormState.data.objetivo || 'Não informado',
    funcao_principal: FormState.data.funcao_principal || 'Não informado',
    possui_bot: FormState.data.possui_bot || 'Não informado',

    // Canais (array)
    canais: Array.isArray(FormState.data.canais) && FormState.data.canais.length > 0
      ? FormState.data.canais
      : ['Não informado'],

    // Integrações
    integracao_sistema: FormState.data.integracao_sistema || 'Não informado',
    ferramentas_atuais: Array.isArray(FormState.data.ferramentas_atuais) && FormState.data.ferramentas_atuais.length > 0
      ? FormState.data.ferramentas_atuais
      : ['Não informado'],
    integracao_terceiros: FormState.data.integracao_terceiros || 'Não informado',

    // Datas e valores
    data_aproximada: FormState.data.data_aproximada || 'Não informado',
    faturamento: FormState.data.faturamento || 'Não informado',
    investimento: FormState.data.investimento || 'Não informado',

    // Campos extras que podem existir
    segmento: FormState.data.segmento || 'Não informado',
    desafios: FormState.data.desafios || 'Não informado',
    expectativas: FormState.data.expectativas || 'Não informado',
    urgencia: FormState.data.urgencia || 'Não informado',
    como_conheceu: FormState.data.como_conheceu || 'Não informado',

    // Metadata
    timestamp: new Date().toISOString(),
    dataFormatada: new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    origem: 'Landing Page Diagnóstico',
    url: window.location.href,
    timeSpent: Math.round((Date.now() - FormState.startTime) / 1000) + ' segundos'
  };

  console.log('=== PAYLOAD FINAL ===');
  console.log(JSON.stringify(payload, null, 2));
  console.log('====================');

  try {
    // Envia dados para o webhook
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    console.log('✅ Dados enviados com sucesso para o webhook!');

    // Remove loading e mostra sucesso
    hideLoadingAnimation();
    showSuccessAnimation();

    // Limpa localStorage após envio bem-sucedido
    localStorage.removeItem('hodevweb_diagnostic');
    localStorage.removeItem('hodevweb_step');

    // Redireciona após animação
    setTimeout(() => {
      window.location.href = 'obrigado.html';
    }, 1500);

  } catch (error) {
    console.error('❌ Erro ao enviar dados:', error);

    // Remove loading
    hideLoadingAnimation();

    // Salva dados no localStorage como backup
    localStorage.setItem('hodevweb_diagnostic_final', JSON.stringify(payload));

    // Mostra modal de erro
    showErrorModal('Não foi possível enviar seus dados. Seus dados foram salvos localmente.');

    // Redireciona após 3 segundos mesmo com erro
    setTimeout(() => {
      window.location.href = 'obrigado.html';
    }, 3000);
  }
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

// Recupera progresso salvo
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
  localStorage.removeItem('hodevweb_diagnostic_final');
  FormState.data = {};
  FormState.currentStep = 1;
}

// Debug - mostrar todos os dados coletados
function debugFormData() {
  console.log('=== DEBUG FORM DATA ===');
  console.log('Current Step:', FormState.currentStep);
  console.log('Data:', JSON.stringify(FormState.data, null, 2));
  console.log('=======================');
}
