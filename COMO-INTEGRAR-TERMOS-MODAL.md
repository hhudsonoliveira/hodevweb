# 📋 Como Integrar o Modal de Termos em Outro Projeto

Este guia explica como adicionar o modal de termos de uso (LGPD) em qualquer projeto com formulário de contato.

---

## 📦 **Arquivos Necessários**

Você tem 3 arquivos para copiar:

1. **terms-modal-html.txt** → Código HTML do modal
2. **terms-modal-css.txt** → Estilos CSS do modal
3. **terms-modal-js.txt** → Lógica JavaScript do modal

---

## 🚀 **Passo a Passo de Integração**

### **1. Adicionar HTML**

Abra o arquivo **terms-modal-html.txt** e copie TODO o conteúdo.

Cole no seu arquivo HTML **ANTES da tag `</body>`**:

```html
    <!-- Seu conteúdo existente -->
  </footer>

  <!-- Cole o modal aqui -->
  <div id="termsModal" class="modal">
    ...
  </div>

</body>
</html>
```

**⚠️ IMPORTANTE:** Atualize o email de contato na seção "4. Direitos do Usuário":
```html
<p>Para exercer esses direitos, entre em contato conosco através do e-mail:
   <strong>SEU-EMAIL-AQUI@exemplo.com</strong>
</p>
```

---

### **2. Adicionar CSS**

Abra o arquivo **terms-modal-css.txt** e copie TODO o conteúdo.

Cole no seu arquivo CSS principal (pode ser no final do arquivo):

```css
/* Seus estilos existentes */

/* ============================================
   MODAL DE TERMOS DE USO - CSS
   ============================================ */
.modal {
  display: none;
  ...
}
```

**🎨 Personalizações opcionais:**

Se quiser mudar as cores, altere estas variáveis:

```css
/* Cor principal do tema (roxo) */
background: #6c5ce7;  /* Mude para sua cor */

/* Cor de hover */
background: #5a4bc9;  /* Mude para versão mais escura */

/* Cor de fundo do conteúdo */
background: #f7f7f7;  /* Mude se necessário */
```

---

### **3. Adicionar JavaScript**

Abra o arquivo **terms-modal-js.txt** e copie TODO o conteúdo.

Cole no seu arquivo JavaScript principal:

```javascript
// Seu código JavaScript existente

/* ============================================
   MODAL DE TERMOS DE USO - JAVASCRIPT
   ============================================ */
let formDataTemp = null;

function openTermsModal() {
  ...
}
```

**⚠️ ADAPTE A FUNÇÃO `sendEmailAfterTerms()`:**

A função atual tem um exemplo com `fetch`. Você precisa adaptar para sua lógica de envio:

**Exemplo 1: Se você usa EmailJS**
```javascript
async function sendEmailAfterTerms() {
  if (!formDataTemp) return;

  const { name, email, phone, message, inputs } = formDataTemp;
  closeTermsModal();

  // Seu código EmailJS
  emailjs.send(serviceID, templateID, {
    name: name,
    email: email,
    phone: phone,
    message: message
  }).then(() => {
    // Limpar formulário
    inputs.nameInput.value = '';
    inputs.emailInput.value = '';
    inputs.phoneInput.value = '';
    inputs.messageInput.value = '';

    alert("Formulário enviado com sucesso!");
  }).catch((error) => {
    alert("Erro ao enviar. Tente novamente.");
    console.error(error);
  });

  formDataTemp = null;
}
```

**Exemplo 2: Se você usa API Backend**
```javascript
async function sendEmailAfterTerms() {
  if (!formDataTemp) return;

  const { name, email, phone, message, inputs } = formDataTemp;
  closeTermsModal();

  try {
    const response = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message })
    });

    if (response.ok) {
      // Limpar formulário
      inputs.nameInput.value = '';
      inputs.emailInput.value = '';
      inputs.phoneInput.value = '';
      inputs.messageInput.value = '';

      alert("Formulário enviado com sucesso!");
    } else {
      alert("Erro ao enviar. Tente novamente.");
    }
  } catch (error) {
    alert("Erro ao enviar. Tente novamente.");
  }

  formDataTemp = null;
}
```

---

### **4. Adaptar IDs do Formulário**

Certifique-se que seu formulário HTML tenha os IDs corretos:

```html
<form>
  <input type="text" id="nome" name="nome">
  <input type="email" id="email" name="email">
  <input type="tel" id="tel" name="tel">
  <textarea id="msg" name="mensagem"></textarea>
  <button type="button" id="send">Enviar</button>
</form>
```

**Se seus IDs forem diferentes**, altere no JavaScript:

```javascript
// Procure estas linhas e mude os IDs
const nameInput = document.getElementById("nome");      // Mude "nome" se necessário
const emailInput = document.getElementById("email");    // Mude "email" se necessário
const phoneInput = document.getElementById("tel");      // Mude "tel" se necessário
const messageInput = document.getElementById("msg");    // Mude "msg" se necessário
const sendButton = document.getElementById("send");     // Mude "send" se necessário
```

---

## ✅ **Checklist de Integração**

- [ ] HTML do modal adicionado antes de `</body>`
- [ ] Email de contato atualizado na seção "Direitos do Usuário"
- [ ] CSS do modal adicionado ao arquivo de estilos
- [ ] Cores personalizadas (se necessário)
- [ ] JavaScript adicionado ao arquivo JS
- [ ] Função `sendEmailAfterTerms()` adaptada para sua lógica
- [ ] IDs do formulário conferidos e ajustados
- [ ] Testado em navegador

---

## 🧪 **Como Testar**

1. **Abra o site no navegador**
2. **Preencha o formulário**
3. **Clique em "Enviar"**
   - ✅ Modal de termos deve abrir
4. **Tente clicar "Confirmar e Enviar"**
   - ✅ Botão deve estar desabilitado
5. **Marque o checkbox**
   - ✅ Botão deve habilitar
6. **Clique "Confirmar e Enviar"**
   - ✅ Modal deve fechar
   - ✅ Email deve ser enviado
   - ✅ Mensagem de sucesso deve aparecer
   - ✅ Formulário deve ser limpo

---

## 🎨 **Personalizações Comuns**

### **Mudar cor do tema**
```css
/* No arquivo CSS, procure por #6c5ce7 e substitua */
background: #6c5ce7;  →  background: #SUA-COR;
color: #6c5ce7;       →  color: #SUA-COR;
```

### **Mudar altura do scroll**
```css
.terms__content {
  max-height: 400px;  /* Mude para 300px, 500px, etc */
}
```

### **Mudar largura do modal**
```css
.modal__content--terms {
  max-width: 700px;  /* Mude para 600px, 800px, etc */
}
```

### **Mudar texto do botão**
```html
<button id="confirmTermsBtn">
  Confirmar e Enviar  <!-- Mude o texto aqui -->
</button>
```

---

## ❓ **Solução de Problemas**

### **Modal não abre**
- ✅ Verifique se o HTML foi colado corretamente
- ✅ Verifique se o JavaScript está carregando (F12 → Console)
- ✅ Verifique se não há erros no Console

### **Botão não habilita ao marcar checkbox**
- ✅ Verifique IDs: `termsCheckbox` e `confirmTermsBtn`
- ✅ Verifique se o event listener está sendo adicionado

### **Email não envia**
- ✅ Verifique se você adaptou a função `sendEmailAfterTerms()`
- ✅ Verifique erros no Console (F12)
- ✅ Verifique se sua API/EmailJS está configurado

### **Modal não fecha ao clicar no X**
- ✅ Verifique ID: `closeTermsBtn`
- ✅ Verifique se o event listener foi adicionado

---

## 📞 **Suporte**

Se tiver problemas na integração:
1. Abra o Console do navegador (F12)
2. Procure por erros em vermelho
3. Verifique se todos os IDs estão corretos
4. Verifique se o CSS e JS foram carregados

---

## 📄 **Resumo dos Arquivos**

| Arquivo | Descrição | Onde Colar |
|---------|-----------|------------|
| terms-modal-html.txt | HTML do modal | Antes de `</body>` |
| terms-modal-css.txt | Estilos CSS | No arquivo CSS principal |
| terms-modal-js.txt | Lógica JavaScript | No arquivo JS principal |

---

## ✨ **Pronto!**

Seu modal de termos LGPD está integrado e funcionando!

🎉 **Benefícios:**
- ✅ Conformidade com LGPD
- ✅ Consentimento explícito
- ✅ UX profissional
- ✅ Fácil personalização
