// ============================================================================
// Backend API Server for hodevweb
// ============================================================================
// This server acts as a proxy to hide EmailJS credentials from the frontend
// IMPORTANT: This is a basic example. For production, add:
//   - Rate limiting
//   - CORS configuration
//   - Input validation
//   - Error logging
//   - Authentication (if needed)
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================
// Middleware
// ============================

// Security headers
app.use(helmet());

// CORS configuration - adjust origins for production
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['POST'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }));

// Rate limiting: max 5 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/send-email', limiter);

// ============================
// Email Sending Endpoint
// ============================

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes: name, email, message'
      });
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    // ============================
    // Option 1: Using EmailJS
    // ============================
    const emailjs = require('@emailjs/nodejs');

    const emailData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        name,
        email,
        phone: phone || 'Não informado',
        message,
        timestamp: timestamp || new Date().toISOString()
      }
    };

    const response = await emailjs.send(
      emailData.service_id,
      emailData.template_id,
      emailData.template_params,
      {
        publicKey: emailData.user_id,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // Optional: for better security
      }
    );

    console.log('Email enviado com sucesso:', response.status);

    res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);

    // Don't expose internal error details to client
    res.status(500).json({
      error: 'Erro ao processar requisição. Tente novamente mais tarde.'
    });
  }
});

// ============================
// Alternative: Using Nodemailer (SMTP)
// ============================
// Uncomment this section if you prefer to use Nodemailer instead of EmailJS
/*
const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: `Novo contato de ${name}`,
      html: `
        <h2>Nova mensagem do formulário de contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Enviado em: ${new Date().toLocaleString('pt-BR')}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({
      error: 'Erro ao processar requisição'
    });
  }
});
*/

// ============================
// Health Check
// ============================

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================
// Error Handler
// ============================

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// ============================
// Start Server
// ============================

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🔒 CORS habilitado para: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`);
  console.log(`📧 EmailJS Service ID: ${process.env.EMAILJS_SERVICE_ID ? '✓ Configurado' : '✗ Não configurado'}`);
});

module.exports = app;
