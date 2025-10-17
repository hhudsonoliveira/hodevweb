# 🔒 Política de Segurança - Hodevweb

## 📋 Sumário

Este documento descreve as práticas de segurança implementadas no projeto Hodevweb e fornece diretrizes para manter o sistema seguro.

## ⚠️ Vulnerabilidades Corrigidas

### 1. Exposição de Credenciais (CRÍTICO) ✅ CORRIGIDO

**Problema:**
- Chaves de API EmailJS estavam hardcoded no código-fonte
- Qualquer pessoa poderia visualizar as credenciais no código cliente

**Solução Implementada:**
- Movido credenciais para variáveis de ambiente (`.env`)
- Criado backend API para proxy de emails
- Implementado sistema dual: backend seguro ou EmailJS direto (apenas dev)

**Localização das Mudanças:**
- [web/index.html:314-317](web/index.html#L314-L317) - Removidas credenciais
- [web/script/index.js:401-446](web/script/index.js#L401-L446) - Sistema configurável
- [backend/server.js](backend/server.js) - Backend seguro criado

### 2. Console.log em Produção ✅ CORRIGIDO

**Problema:**
- Logs expostos no navegador podem revelar informações sensíveis

**Solução:**
- Logs condicionais baseados em `NODE_ENV`
- Apenas em desenvolvimento: `console.log` ativo

**Localização:**
- [web/script/index.js:306-308](web/script/index.js#L306-L308)
- [web/script/index.js:433-435](web/script/index.js#L433-L435)

## 🛡️ Recursos de Segurança Implementados

### Frontend

#### 1. Sanitização de Inputs
- **Nome:** Remove caracteres especiais, permite apenas letras, espaços, hífen e apóstrofo
- **Email:** Normaliza para lowercase, remove caracteres inválidos
- **Telefone:** Mantém apenas dígitos e '+' no início
- **Mensagem:** Remove HTML tags, SQL injection patterns, XSS vectors

**Código:** [web/script/index.js:166-206](web/script/index.js#L166-L206)

#### 2. Validação Client-Side
- Formato de email (regex)
- Formato de telefone (8-15 dígitos)
- Campos obrigatórios
- Tamanho mínimo de mensagem

**Código:** [web/script/index.js:215-231](web/script/index.js#L215-L231)

#### 3. Normalização Unicode (NFKC)
Previne ataques de homógrafos e compatibility forms

**Código:** [web/script/index.js:152-154](web/script/index.js#L152-L154)

#### 4. Remoção de Caracteres de Controle
Remove caracteres invisíveis que podem ser usados em ataques

**Código:** [web/script/index.js:156-161](web/script/index.js#L156-L161)

### Backend

#### 1. Rate Limiting
- **Limite:** 5 requisições por IP a cada 15 minutos
- **Proteção:** Spam, brute force, DoS

**Código:** [backend/server.js:27-35](backend/server.js#L27-L35)

#### 2. CORS Configurado
- Apenas origens permitidas podem fazer requisições
- Configurável via variável de ambiente `ALLOWED_ORIGINS`

**Código:** [backend/server.js:19-24](backend/server.js#L19-L24)

#### 3. Helmet (Security Headers)
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security
- Content-Security-Policy

**Código:** [backend/server.js:16](backend/server.js#L16)

#### 4. Validação Server-Side
- Campos obrigatórios
- Formato de email
- Limite de tamanho de payload (10kb)

**Código:** [backend/server.js:43-57](backend/server.js#L43-L57)

## 🔐 Gestão de Credenciais

### ✅ Boas Práticas Implementadas

1. **Variáveis de Ambiente:**
   - Credenciais nunca commitadas no Git
   - `.env.example` fornecido como template
   - `.gitignore` configurado para bloquear `.env`

2. **Separação de Ambientes:**
   - Desenvolvimento: pode usar EmailJS direto
   - Produção: DEVE usar backend API

3. **Documentação:**
   - README com instruções claras de setup
   - Avisos sobre não commitar credenciais

### ⚠️ Ações Necessárias do Desenvolvedor

1. **Criar arquivo `.env` na raiz:**
   ```bash
   cp .env.example .env
   # Editar com suas credenciais reais
   ```

2. **Criar arquivo `backend/.env`:**
   ```bash
   cd backend
   cp .env.example .env
   # Editar com credenciais EmailJS
   ```

3. **NUNCA commitar:**
   - `.env`
   - Qualquer arquivo com credenciais
   - Tokens de API

## 🚨 Reportando Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, por favor:

1. **NÃO** crie uma issue pública
2. Envie um email privado para: [seu-email@example.com]
3. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se possível)

## 📝 Checklist de Segurança para Deploy

Antes de fazer deploy em produção:

- [ ] Variáveis de ambiente configuradas no servidor
- [ ] `.env` NÃO está commitado no repositório
- [ ] Backend está rodando e acessível
- [ ] `USE_BACKEND = true` em `web/script/index.js`
- [ ] CORS configurado apenas para seu domínio
- [ ] HTTPS habilitado (SSL/TLS)
- [ ] Rate limiting testado e funcionando
- [ ] Logs de erro monitorados
- [ ] Testes de segurança executados

## 🔄 Atualizações Futuras Recomendadas

### Alta Prioridade
- [ ] Implementar CAPTCHA (Google reCAPTCHA v3)
- [ ] Adicionar autenticação JWT para área admin
- [ ] Implementar logging centralizado (Winston/Bunyan)
- [ ] Adicionar monitoramento de segurança (Snyk, Dependabot)

### Média Prioridade
- [ ] Implementar CSP (Content Security Policy) headers
- [ ] Adicionar honeypot fields no formulário
- [ ] Implementar webhook de notificação de erros
- [ ] Testes automatizados de segurança (OWASP ZAP)

### Baixa Prioridade
- [ ] Implementar 2FA para área administrativa
- [ ] Adicionar assinatura de requests (HMAC)
- [ ] Implementar rotação de chaves de API

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 📅 Histórico de Atualizações

### 2025-01-16
- ✅ Removido credenciais hardcoded
- ✅ Criado backend API seguro
- ✅ Implementado rate limiting
- ✅ Configurado CORS e Helmet
- ✅ Adicionado sanitização avançada
- ✅ Criado documentação de segurança

---

**Última atualização:** 2025-01-16
**Mantido por:** Hudson Oliveira
