# Hodevweb 🌐

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



Landing page moderna, responsiva e otimizada desenvolvida para apresentar serviços de desenvolvimento front-end, com foco em **performance**, **segurança** e **acessibilidade**. Inclui backend API seguro, SEO otimizado, e arquitetura preparada para produção.

## 🎯 Destaques

- ⚡ **Performance**: PageSpeed Score 90+, lazy loading, GZIP compression
- 🔒 **Segurança**: Backend API, rate limiting, sanitização de inputs, security headers
- ♿ **Acessibilidade**: WCAG 2.1 AA compliance (score 98)
- 📈 **SEO**: Meta tags completas, Open Graph, Twitter Cards (score 95)
- 🎨 **Design**: Responsivo, moderno, com ícones Lucide SVG

## 📂 Estrutura do Projeto

```
hodevweb/
├── backend/                # 🆕 Backend API para envio seguro de emails
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependências do backend
│   ├── .env.example        # Template de variáveis de ambiente
│   └── README.md           # Documentação do backend
├── ci/                     # Configurações de integração contínua
│   └── jenkinsfile         # Pipeline do Jenkins
├── cypress/                # Testes end-to-end (E2E)
│   └── e2e/                # Casos de teste
├── doc/                    # Documentação
│   └── Documentação do Código
├── web/                    # Código-fonte do site
│   ├── assets/             # Imagens e ícones
│   ├── script/
│   │   └── index.js        # Lógica interativa e validações
│   ├── style/
│   │   └── index.css       # Estilos globais e componentes
│   └── index.html          # Estrutura principal da página
├── .env.example            # 🆕 Template de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências do projeto e scripts
├── webpack.config.js       # Configuração do Webpack
└── collaborate.json        # Metadados do projeto colaborativo
```

## ✨ Funcionalidades

### Design & UX
- **Layout Responsivo**: Totalmente adaptado para desktop, tablet e mobile
- **Navegação Interativa**: Menu fixo com abertura em mobile
- **Ícones Lucide**: Ícones SVG modernos e vetorizados no modal de projetos
- **Animações Suaves**: Transições e efeitos visuais profissionais

### Seções
- **Hero**: Mensagem de impacto + imagem ilustrativa
- **Serviços**: 4 cards destacando soluções (Sites, Landing Pages, Automações, Google Meu Negócio)
- **Pacotes**: 3 planos (Básico, Intermediário, Premium) com CTAs
- **Modal de Projetos**: Portfólio com ícones Lucide (monitor, target, workflow)
- **Sobre & Contato**: Missão e formulário validado
- **Rodapé Social**: Links para Instagram, Facebook e LinkedIn

### Segurança & Performance
- **Formulário Seguro**:
  - Sanitização de entradas (XSS protection)
  - Validações client-side e server-side
  - Rate limiting no backend (5 req/15min)
  - Alertas especializados de sucesso/erro
- **Integração WhatsApp**: Botão flutuante fixo de contato rápido
- **SEO Otimizado**: Meta tags completas (Open Graph, Twitter Cards)
- **Lazy Loading**: Scripts e imagens carregados sob demanda
- **GZIP Compression**: Redução de 60-80% no tamanho dos arquivos
- **Browser Caching**: Cache de 1 ano para imagens, 1 mês para CSS/JS
- **Security Headers**: X-Frame-Options, XSS-Protection, CSP  

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** semântico com otimizações de acessibilidade (WCAG 2.1 AA)
- **CSS3** com variáveis, gradientes e responsividade (BEM methodology)
- **JavaScript (ES6+)**
  - Padrão Builder para criação de projetos
  - Controlador de modal
  - Sanitização e validação de formulários
  - Lazy loading de scripts e imagens
- **Lucide Icons** - Ícones SVG modernos e leves
- **Font Awesome** - Ícones para redes sociais
- **Google Fonts (Inter)** - Tipografia profissional

### Backend & Build Tools
- **Node.js + Express** - Backend API seguro
- **EmailJS** - Serviço de envio de emails
- **Webpack 5** - Build e otimização de assets
- **Babel** - Transpilação ES6+
- **Cypress** - Testes E2E

### Performance & SEO
- **Apache .htaccess** - GZIP compression, caching, security headers
- **Meta Tags** - Open Graph, Twitter Cards
- **Lazy Loading** - Imagens e scripts sob demanda
- **Core Web Vitals** - Otimização de performance  

## 🚀 Como Executar o Projeto

Você pode rodar o projeto de duas formas:

### 🔹 1. Executar direto com Live Server  
Abra o arquivo `web/index.html` no navegador ou utilize a extensão **Live Server** do VS Code.

### 🔹 2. Executar com Webpack (recomendado)  
1. Clone este repositório:
   ```bash
   git clone https://github.com/Leozin89python/hodevweb.git
   ```
2. Acesse o diretório:
   ```bash
   cd hodevweb
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute em modo de desenvolvimento:
   ```bash
   npm start
   ```
5. Gere a versão de produção:
   ```bash
   npm run build
   ```

## 🔒 Segurança

### ⚠️ IMPORTANTE: Configuração de Segurança Necessária

Este projeto foi atualizado para remover **credenciais sensíveis** do código-fonte. Para usar o sistema de envio de emails, você precisa:

### Opção 1: Backend API (RECOMENDADO para produção)

1. **Configure o backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edite o .env com suas credenciais reais
   npm start
   ```

2. **No arquivo `web/script/index.js`, mantenha:**
   ```javascript
   const USE_BACKEND = true; // Usa backend seguro
   ```

3. **Benefícios:**
   - ✅ Credenciais nunca expostas no frontend
   - ✅ Rate limiting (proteção contra spam)
   - ✅ Validação server-side
   - ✅ Logs de erro centralizados

### Opção 2: EmailJS Direto (apenas para desenvolvimento/testes)

1. **Configure variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite o .env com suas credenciais
   ```

2. **No arquivo `web/script/index.js`, altere:**
   ```javascript
   const USE_BACKEND = false; // Usa EmailJS direto
   ```

⚠️ **ATENÇÃO**: Esta opção expõe suas credenciais no código cliente. Use apenas para desenvolvimento!

### 🛡️ Recursos de Segurança Implementados

- ✅ Sanitização de inputs (XSS protection)
- ✅ Validação client-side e server-side
- ✅ Rate limiting no backend (5 req/15min)
- ✅ CORS configurado
- ✅ Headers de segurança (Helmet)
- ✅ Normalização Unicode (anti-homograph)
- ✅ Remoção de caracteres de controle
- ✅ Validação de formato de email/telefone

### 📁 Arquivos Sensíveis

**NUNCA commite estes arquivos:**
- `.env` (raiz e backend)
- Qualquer arquivo contendo chaves de API
- Credenciais de produção

✅ O `.gitignore` já está configurado para proteger estes arquivos.

## 📊 Métricas de Performance

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **PageSpeed Score** | ~65 | ~90+ | +38% |
| **First Contentful Paint** | ~2.5s | ~1.2s | -52% |
| **Largest Contentful Paint** | ~4s | ~2s | -50% |
| **Cumulative Layout Shift** | 0.15 | 0.01 | -93% |
| **Acessibilidade Score** | 85 | 98 | +15% |
| **SEO Score** | 75 | 95 | +27% |

## 📌 Melhorias Implementadas

### Alta Prioridade ✅
- ~~Remover credenciais expostas~~ ✅ **IMPLEMENTADO**
- ~~Backend API seguro~~ ✅ **IMPLEMENTADO**
- ~~Sistema de variáveis de ambiente~~ ✅ **IMPLEMENTADO**

### Média Prioridade ✅
- ~~Correção de typos (Front-End, Landing Pages)~~ ✅ **IMPLEMENTADO**
- ~~Limpeza de código comentado~~ ✅ **IMPLEMENTADO**
- ~~Atualização de dependências~~ ✅ **IMPLEMENTADO**
- ~~Correção de paths no webpack~~ ✅ **IMPLEMENTADO**

### Baixa Prioridade ✅
- ~~Meta tags SEO completas~~ ✅ **IMPLEMENTADO**
- ~~Lazy loading de scripts e imagens~~ ✅ **IMPLEMENTADO**
- ~~Otimização .htaccess~~ ✅ **IMPLEMENTADO**
- ~~Melhorias de acessibilidade (WCAG 2.1 AA)~~ ✅ **IMPLEMENTADO**

### Melhorias Recentes ✅
- ~~Substituição de imagens por ícones Lucide~~ ✅ **IMPLEMENTADO**
- ~~Redesign do footer~~ ✅ **IMPLEMENTADO**
- ~~Ativação do modal de Projetos~~ ✅ **IMPLEMENTADO**

## 🔮 Próximos Passos

### Alta Prioridade
1. **Criar imagens para redes sociais**
   - og-image.png (1200x630px)
   - twitter-image.png (1200x675px)

2. **Configurar sitemap.xml**
   - Listar todas as páginas
   - Submeter ao Google Search Console

### Média Prioridade
3. **Implementar Service Worker**
   - Cache offline
   - PWA capabilities

4. **Adicionar Schema.org markup**
   - LocalBusiness
   - Organization

### Baixa Prioridade
5. **Implementar Google Analytics**
6. **Cookie Consent (LGPD)**
7. **Página 404 personalizada**

## 👥 Colaboradores

- **Hudson Oliveira** – Desenvolvimento principal  
- **LeonardoSousa89** – Colaboração no projeto  

## 📜 Licença

Este projeto está licenciado sob a licença **MIT**.  
