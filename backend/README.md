# Backend API - Hodevweb

Backend seguro para processamento de formulários e envio de emails.

## 🔒 Segurança

Este backend foi criado para **esconder credenciais sensíveis** do frontend, evitando exposição de chaves de API no código cliente.

## 🚀 Instalação

1. Navegue até o diretório backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais reais do EmailJS

## ▶️ Execução

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

O servidor iniciará na porta **3001** (ou a porta definida em `PORT` no `.env`)

## 📡 Endpoints

### POST /api/send-email

Envia email via EmailJS

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+5511999999999",
  "message": "Mensagem de contato",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email enviado com sucesso"
}
```

**Response (Error):**
```json
{
  "error": "Mensagem de erro"
}
```

### GET /health

Verifica se o servidor está funcionando

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 🛡️ Recursos de Segurança

- **Rate Limiting**: Máximo de 5 requisições por IP a cada 15 minutos
- **CORS**: Configurado para aceitar apenas origens permitidas
- **Helmet**: Headers de segurança HTTP
- **Validação de Input**: Validação básica de campos obrigatórios
- **Sanitização**: Previne injeção de código

## 🔄 Alternativa: Nodemailer

Se preferir usar SMTP direto ao invés de EmailJS, descomente a seção Nodemailer no arquivo `server.js` e configure as variáveis SMTP no `.env`

## 📦 Deploy

### Heroku
```bash
heroku create hodevweb-api
heroku config:set EMAILJS_PUBLIC_KEY=your_key
heroku config:set EMAILJS_SERVICE_ID=your_service_id
# ... outras variáveis
git push heroku main
```

### Vercel / Railway / Render
Configure as variáveis de ambiente no dashboard e faça deploy do diretório `backend`

## ⚠️ IMPORTANTE

- **NUNCA** commite o arquivo `.env` com credenciais reais
- Use variáveis de ambiente em produção
- Configure CORS adequadamente para aceitar apenas seu domínio
- Monitore logs de erro em produção
- Configure SSL/HTTPS em produção
