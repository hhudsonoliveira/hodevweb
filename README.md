# Hodevweb 🌐

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



Landing page moderna e responsiva desenvolvida para apresentar serviços de desenvolvimento front-end, pacotes de sites e contato direto via WhatsApp.

## 📂 Estrutura do Projeto

```
hodevweb/
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
├── .gitignore              # Arquivos ignorados pelo Git
├── .htaccess               # Configuração para servidor Apache
├── package.json            # Dependências do projeto e scripts
├── package-lock.json       # Versões bloqueadas das dependências
├── webpack.config.js       # Configuração do Webpack
└── collaborate.json        # Metadados do projeto colaborativo
```

## ✨ Funcionalidades

- **Layout Responsivo**: Totalmente adaptado para desktop, tablet e mobile.  
- **Navegação Interativa**: Menu fixo com abertura em mobile.  
- **Seções principais**:
  - **Hero**: Mensagem de impacto + imagem ilustrativa.  
  - **Serviços**: Cards com principais soluções digitais.  
  - **Pacotes**: Planos Básico, Intermediário e Premium.  
  - **Sobre & Contato**: Informações e formulário validado.  
- **Modal de Projetos**: Estrutura pronta para exibir portfólio com cards dinâmicos.  
- **Formulário Seguro**:
  - Sanitização de entradas (nome, email, telefone, mensagem).  
  - Validações específicas para evitar XSS e inputs inválidos.  
  - Alertas amigáveis de sucesso/erro.  
- **Integração com WhatsApp**: Botão flutuante de contato rápido.  
- **Rodapé Social**: Links para Instagram, Facebook e LinkedIn.  

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico  
- **CSS3** com variáveis, gradientes e responsividade (BEM methodology)  
- **JavaScript (ES6+)**
  - Padrão Builder para criação de projetos
  - Controlador de modal
  - Sanitização e validação de formulários
- **Font Awesome** para ícones  
- **Google Fonts (Inter)**  
- **Cypress** para testes E2E  
- **Webpack 5** para build e otimização  

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

## 📌 Melhorias Futuras

- Conectar formulário a um backend (Node.js, Express ou serviços de email).  
- Preencher e exibir projetos reais no modal de portfólio.  
- Implementar animações com AOS ou Framer Motion.  
- SEO avançado e sitemap.  

## 👥 Colaboradores

- **Hudson Oliveira** – Desenvolvimento principal  
- **LeonardoSousa89** – Colaboração no projeto  

## 📜 Licença

Este projeto está licenciado sob a licença **MIT**.  
