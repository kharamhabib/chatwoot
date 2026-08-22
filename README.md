# Kallia CRM

Plataforma moderna de atendimento ao cliente *omnichannel* e CRM com suporte a automações, múltiplos canais de comunicação e assistência por Inteligência Artificial.

Para uma visão técnica detalhada de arquitetura, fluxo de mensagens, componentes e guia de execução, consulte [ARQUITETURA.MD](./ARQUITETURA.MD).

---

## Principais Funcionalidades

### 💬 Inbox Unificado & Multi-canal
Centralize todas as conversas com clientes em um único lugar:
- WhatsApp (Cloud API, Twilio, 360dialog, etc.)
- Instagram & Facebook Messenger
- E-mail (IMAP/SMTP, SendGrid, Mailgun)
- Telegram & SMS
- Web Widget customizável para websites

### ✨ Copiloto de IA (Captain)
- Automação inteligente de respostas e triagem de conversas.
- Sugestões contextuais para operadores e resolução automática de dúvidas frequentes.

### 👥 Colaboração & Produtividade
- Notas privadas e menções (`@`) entre operadores dentro da conversa.
- Etiquetas (labels) e atributos personalizados para qualificação de leads e contatos.
- Atalhos de teclado e barra de comandos rápidos.
- Respostas prontas (*Canned Responses*) e regras de automação por gatilhos.
- Roteamento e auto-atribuição de conversas por disponibilidade e filas.

### 🎨 Feedback Visual com IA (Agentation)
- Anotação e inspeção de elementos de UI diretamente pelo navegador.
- Ativação sob demanda em desenvolvimento e produção na VPS via URL (`?agentation=true`), console do navegador ou variável `.env`.

---

## 🛠️ Stack Tecnológica

- **Backend:** Ruby on Rails 7.x
- **Frontend:** Vue.js 3 + Vite + TailwindCSS
- **Banco de Dados:** PostgreSQL
- **Processamento Assíncrono:** Redis + Sidekiq
- **Comunicação em Tempo Real:** WebSockets via Rails ActionCable

---

## 🚀 Como Iniciar

### Pré-requisitos
- Ruby (conforme [.ruby-version](./.ruby-version))
- Node.js 22+ & pnpm
- PostgreSQL & Redis

### Desenvolvimento Local
```bash
# 1. Instalar dependências
bundle install
pnpm install

# 2. Configurar banco de dados e sementes
bundle exec rails db:create db:migrate db:seed

# 3. Executar o servidor de desenvolvimento
pnpm dev
# ou
overmind start -f Procfile.dev
```

### Configurações de Ambiente
Consulte o arquivo [.env.example](./.env.example) para configurar credenciais de canais, URLs, banco de dados, chaves de criptografia e desativação de telemetria (`DISABLE_TELEMETRY=true`).

---

## 📖 Documentação & Arquitetura

- Consulte o [ARQUITETURA.MD](./ARQUITETURA.MD) para documentação aprofundada da estrutura do projeto, fluxo de eventos, modelos de dados e orientações de deploy em VPS.
- Consulte o [ENTERPRISE_FEATURES.MD](./ENTERPRISE_FEATURES.MD) para o catálogo de funcionalidades avançadas (SLAs, papéis customizados, auditoria, IA) e arquitetura para recriação independente.
- Registros de implementações e controle de versões disponíveis em [UPDATES.MD](./UPDATES.MD).
