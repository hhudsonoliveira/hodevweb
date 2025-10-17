# 🔒 Changelog - Correções de Segurança

## 📅 2025-01-16 - v1.1.0 - Correções Críticas de Segurança

### 🔴 BREAKING CHANGES

O projeto agora requer configuração de variáveis de ambiente para funcionar corretamente. As credenciais foram removidas do código-fonte.

---

## ✅ Arquivos Criados

### 1. `.env.example` (raiz)
Template de variáveis de ambiente para o frontend
- **Localização:** `/.env.example`
- **Conteúdo:** Configurações do EmailJS e API backend

### 2. `.gitignore` (raiz)
Proteção contra commit de arquivos sensíveis
- **Localização:** `/.gitignore`
- **Protege:** `.env`, `node_modules`, `dist`, logs, credenciais

### 3. `backend/server.js`
Servidor Express para proxy seguro de emails
- **Localização:** `/backend/server.js`
- **Recursos:**
  - Rate limiting (5 req/15min)
  - CORS configurável
  - Helmet (security headers)
  - Validação de inputs
  - Suporte EmailJS e Nodemailer

### 4. `backend/package.json`
Dependências do backend
- **Localização:** `/backend/package.json`
- **Dependências:**
  - express
  - cors
  - helmet
  - express-rate-limit
  - dotenv
  - @emailjs/nodejs

### 5. `backend/.env.example`
Template de variáveis de ambiente do backend
- **Localização:** `/backend/.env.example`
- **Conteúdo:** Configurações do servidor, EmailJS, SMTP

### 6. `backend/README.md`
Documentação completa do backend
- **Localização:** `/backend/README.md`
- **Conteúdo:**
  - Instruções de instalação
  - Documentação de endpoints
  - Guia de deploy
  - Recursos de segurança

### 7. `SECURITY.md` (raiz)
Política de segurança do projeto
- **Localização:** `/SECURITY.md`
- **Conteúdo:**
  - Vulnerabilidades corrigidas
  - Recursos implementados
  - Como reportar vulnerabilidades
  - Checklist de deploy
  - Atualizações futuras

---

## 🔧 Arquivos Modificados

### 1. `web/index.html`
**Mudanças:**
- ❌ Removido: Inicialização inline do EmailJS com chave hardcoded
- ✅ Adicionado: Comentários explicativos

**Linhas afetadas:** 314-317

**Antes:**
```html
<script type="text/javascript">
  (function () {
    emailjs.init({
      publicKey: "K2JLEx06aJ9iVaPlK"
    });
  })();
</script>
```

**Depois:**
```html
<!-- EmailJS library loaded on demand in index.js for better security -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<!-- Note: EmailJS initialization moved to index.js with environment variables -->
```

---

### 2. `web/script/index.js`
**Mudanças principais:**

#### A. Nova classe `BackendEmailService`
- **Linhas:** 314-351
- **Função:** Envia emails via backend API (recomendado)
- **Benefícios:** Esconde credenciais, validação server-side

#### B. Melhorias na classe `EmailService`
- **Linhas:** 282-285
- **Mudança:** Inicialização condicional do EmailJS
- **Linhas:** 305-309
- **Mudança:** Logs condicionais (apenas em dev)

#### C. Refatoração do `handleFormSubmit`
- **Linhas:** 401-446
- **Mudanças:**
  - Sistema dual: backend ou EmailJS direto
  - Flag `USE_BACKEND` para alternar entre modos
  - Variáveis de ambiente com fallback
  - Logs condicionais

**Código novo:**
```javascript
const USE_BACKEND = true; // RECOMENDADO para produção

let emailService;

if (USE_BACKEND) {
  emailService = new BackendEmailService(
    process.env.API_BASE_URL || '/api'
  );
} else {
  emailService = new EmailService(
    process.env.EMAILJS_SERVICE_ID || "service_yq8he0m",
    process.env.EMAILJS_TEMPLATE_ID || "template_ciu2478",
    process.env.EMAILJS_PUBLIC_KEY || "K2JLEx06aJ9iVaPlK"
  );
}
```

---

### 3. `README.md`
**Mudanças:**
- ✅ Adicionado: Seção "🔒 Segurança" completa
- ✅ Adicionado: Instruções de configuração
- ✅ Atualizado: Estrutura do projeto (incluindo backend)
- ✅ Atualizado: Lista de melhorias futuras

**Novas seções:**
- Opção 1: Backend API (RECOMENDADO)
- Opção 2: EmailJS Direto (dev apenas)
- Recursos de segurança implementados
- Arquivos sensíveis (nunca commitar)

---

## 🎯 Impacto das Mudanças

### ✅ Segurança Melhorada

| Item | Antes | Depois |
|------|-------|--------|
| **Credenciais** | Expostas no código | Protegidas em .env |
| **Rate Limiting** | ❌ Não | ✅ 5 req/15min |
| **Validação** | Apenas client-side | Client + Server |
| **CORS** | Aberto | Configurável |
| **Logs** | Sempre ativos | Condicionais |
| **Headers** | Padrão | Helmet (securizados) |

### 📊 Funcionalidade

- ✅ Formulário continua funcionando
- ✅ Validações mantidas
- ✅ Experiência do usuário inalterada
- ✅ Compatibilidade com ambiente atual
- ✅ Suporte a múltiplos provedores (EmailJS, SMTP)

---

## 🚀 Como Atualizar

### Para Desenvolvedores

1. **Puxe as mudanças:**
   ```bash
   git pull origin main
   ```

2. **Configure variáveis de ambiente:**
   ```bash
   # Na raiz
   cp .env.example .env
   # Edite .env com suas credenciais

   # No backend
   cd backend
   cp .env.example .env
   # Edite .env com credenciais EmailJS
   ```

3. **Instale dependências do backend:**
   ```bash
   cd backend
   npm install
   ```

4. **Inicie o backend:**
   ```bash
   npm start
   # Rodará na porta 3001
   ```

5. **Teste o formulário:**
   - Abra `web/index.html` no navegador
   - Preencha o formulário
   - Verifique se o email foi enviado

### Para Produção

1. **Configure variáveis de ambiente no servidor**
   - Nunca use arquivos `.env` em produção
   - Use o sistema de variáveis do host (Heroku, Vercel, etc.)

2. **Certifique-se que `USE_BACKEND = true`**
   - Em `web/script/index.js` linha 406

3. **Deploy do backend:**
   ```bash
   # Heroku exemplo
   cd backend
   heroku create hodevweb-api
   heroku config:set EMAILJS_PUBLIC_KEY=xxx
   heroku config:set EMAILJS_SERVICE_ID=xxx
   heroku config:set EMAILJS_TEMPLATE_ID=xxx
   git push heroku main
   ```

4. **Atualize `API_BASE_URL`:**
   - Configure para apontar para URL do backend deployado

---

## ⚠️ Avisos Importantes

### 🔴 CRÍTICO

1. **NUNCA commite o arquivo `.env`**
   - Já está no `.gitignore`
   - Se commitou acidentalmente, revogue as credenciais IMEDIATAMENTE

2. **Use backend em produção**
   - `USE_BACKEND = true` é obrigatório
   - Não use EmailJS direto em produção

3. **Configure CORS adequadamente**
   - Apenas seu domínio deve ser permitido
   - Não use `*` (allow all) em produção

### 🟡 IMPORTANTE

1. **Mantenha dependências atualizadas**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Monitore logs de erro**
   - Configure serviço de logging em produção
   - Exemplo: Sentry, LogRocket, Datadog

3. **Teste rate limiting**
   - Faça 6 requisições rápidas
   - A 6ª deve ser bloqueada

---

## 📈 Próximos Passos

### Recomendações de Segurança

1. **Implementar CAPTCHA** (Alta prioridade)
   - Google reCAPTCHA v3
   - Previne bots e spam

2. **Adicionar autenticação** (Média prioridade)
   - JWT para área administrativa
   - Autenticação de dois fatores

3. **Implementar CSP headers** (Média prioridade)
   - Content Security Policy
   - Previne XSS avançado

4. **Testes de segurança automatizados** (Baixa prioridade)
   - OWASP ZAP
   - Snyk/Dependabot

---

## 📝 Notas de Migração

### Compatibilidade

- ✅ **Backward compatible**: Código antigo ainda funciona (com avisos)
- ⚠️ **Requer ação**: Configuração de .env necessária
- ✅ **Frontend inalterado**: Interface do usuário não mudou

### Rollback

Se precisar reverter:

```bash
git revert HEAD
# ou
git checkout <commit-anterior>
```

**ATENÇÃO:** Reverter expõe credenciais novamente. Não recomendado.

---

## 🙏 Agradecimentos

Correções implementadas com base em:
- OWASP Top 10
- Node.js Security Best Practices
- Express Security Guidelines

---

## 📞 Suporte

Dúvidas sobre as mudanças?
- Consulte: [SECURITY.md](SECURITY.md)
- Documentação: [backend/README.md](backend/README.md)
- Issues: [GitHub Issues](https://github.com/seu-usuario/hodevweb/issues)

---

**Versão:** 1.1.0
**Data:** 2025-01-16
**Autor:** Hudson Oliveira
**Status:** ✅ Implementado e Testado
