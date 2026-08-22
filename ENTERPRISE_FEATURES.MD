# Catálogo de Recursos Enterprise (Para Recriação Futura)

Este documento cataloga detalhadamente todos os recursos que faziam parte da pasta proprietária `enterprise/` da Chatwoot Inc. (sob licença comercial restrita), explicando **o que cada um fazia**, **sua arquitetura** e **como podem ser recriados de forma 100% Open Source (MIT) e independente**.

---

## 1. Gestão de SLAs (Service Level Agreements)

### O que fazia:
- Permitia definir metas de tempo para:
  - **Primeira Resposta (First Response Time):** ex: Responder em até 15 minutos.
  - **Tempo de Resolução (Resolution Time):** ex: Resolver em até 4 horas.
- Monitorava o tempo das conversas abertas e disparava eventos (`sla_event`) com alertas visuais de aviso (*SLA Missed / Breached*).
- Registrava histórico de cumprimento de metas por atendente e caixa de entrada.

### Como recriar no Kallia CRM (Open Source):
1. **Modelos:** Criar `SlaPolicy` (nome, tempos limite em minutos, inboxes associadas) e associar `sla_policy_id` à tabela `conversations`.
2. **Job de Monitoramento:** Um worker do Sidekiq (ex: `Sla::CheckBreachesJob`) executado a cada minuto ou agendado no momento de criação da mensagem (`wait_until: conversation.sla_deadline`).
3. **Notificação:** Disparar notificação via ActionCable para destacar o card da conversa com badge vermelho ou amarelo quando o tempo expirar.

---

## 2. Limites de Capacidade & Balanceamento de Carga (*Agent Capacity*)

### O que fazia:
- Limitava o número máximo de conversas simultâneas que cada operador podia atender (ex: máximo de 5 conversas abertas por atendente).
- O algoritmo de distribuição automática (*Round Robin / Auto Assignment*) ignorava operadores que estivessem com a capacidade esgotada.

### Como recriar no Kallia CRM (Open Source):
1. **Atributo:** Adicionar uma coluna `max_capacity` (integer, default: 5) na tabela `users` ou `account_users`.
2. **Serviço de Distribuição:** No `AutoAssignmentPipelines` / `AutoAssignmentService`, incluir o filtro de capacidade:
   ```ruby
   available_agents = inbox.members.select do |agent|
     open_chats = agent.assigned_conversations.where(status: :open, account_id: account.id).count
     open_chats < (agent.max_capacity || 5)
   end
   ```

---

## 3. Papéis e Permissões Customizadas (*Custom Roles*)

### O que fazia:
- Permitia criar papéis além dos padrões (`administrator` e `agent`), como *Supervisor*, *Líder de Suporte*, *Operador Financeiro*.
- Concedia permissões granulares por módulo (ex: pode ver relatórios, mas não pode alterar configurações de canal).

### Como recriar no Kallia CRM (Open Source):
1. **Tabela de Papéis:** Criar modelo `CustomRole` pertencente à `Account`, contendo uma coluna `permissions` (array de strings: `['reports:read', 'conversations:manage', 'contacts:export']`).
2. **Autorização:** Atualizar as policies do Pundit (`app/policies/`) para checar `user.has_permission?('reports:read')`.

---

## 4. Auditoria de Ações (*Audit Logs*)

### O que fazia:
- Registrava trilhas de auditoria para ações sensíveis realizadas por administradores e agentes:
  - Login e logout
  - Exclusão ou alteração de caixas de entrada
  - Exportação de relatórios ou contatos
  - Alterações em regras de automação

### Como recriar no Kallia CRM (Open Source):
1. **Gems Padrão:** Utilizar a gem aberta `paper_trail` ou criar uma tabela simples `audit_logs` (`account_id`, `user_id`, `action`, `auditable_type`, `auditable_id`, `changes`, `ip_address`).
2. **ActiveSupport Notifications:** Escutar eventos de ciclo de vida nos controllers e services para gravar os logs automaticamente.

---

## 5. IA & Copiloto (Captain AI) com RAG / Vetores

### O que fazia:
- Gerava *embeddings* dos artigos do Help Center e salvava em banco de dados vetorial.
- Assistente de IA que:
  - Respondia automaticamente mensagens de clientes com base nos artigos da base de conhecimento.
  - Oferecia uma janela de *Copilot* para o atendente tirar dúvidas ou solicitar melhorias de redação de mensagens.

### Como recriar no Kallia CRM (Open Source):
1. **Banco Vetorial:** Usar a extensão aberta `pgvector` nativa do PostgreSQL.
2. **Serviço de RAG:**
   - Ao criar/editar artigo em `app/models/article.rb`, gerar embedding via API da OpenAI (`text-embedding-3-small`) ou Ollama local.
   - Quando o cliente envia uma mensagem, buscar os artigos mais próximos por similaridade de cosseno (`<=>` do pgvector) e enviar como contexto para o LLM (`gpt-4o-mini`, `claude-3-5-haiku` ou modelos locais).

---

## 6. Autenticação Corporativa (SAML / Single Sign-On)

### O que fazia:
- Integração com provedores de identidade corporativos (Okta, Azure Active Directory / Entra ID, Google Workspace, OneLogin) via protocolo SAML 2.0.

### Como recriar no Kallia CRM (Open Source):
1. **Gem Aberta:** Adicionar `omniauth-saml` ou `ruby-saml`.
2. **Configuração por Conta:** Criar tabela `saml_settings` com `idp_sso_target_url`, `idp_cert` e `issuer`.

---

## 7. Atributos Obrigatórios para Resolução de Conversas

### O que fazia:
- Impedia que um operador marcasse uma conversa como "Resolvida" antes de preencher campos obrigatórios pré-configurados (ex: *Motivo do Contato*, *Categoria do Lead*, *Valor da Venda*).

### Como recriar no Kallia CRM (Open Source):
1. **Configuração:** Adicionar flag `required_on_resolve: true` nos atributos customizados (`custom_attribute_definitions`).
2. **Validação:** No `Conversations::UpdateService`, se o novo status for `resolved`, verificar se todos os atributos com `required_on_resolve: true` possuem valor em `custom_attributes`.

---

## 8. Notas de Avaliação CSAT (*CSAT Review Notes*)

### O que fazia:
- Permitia aos líderes de equipe adicionar observações e feedbacks internos nas respostas da pesquisa de satisfação (*CSAT*) enviadas pelos clientes.

### Como recriar no Kallia CRM (Open Source):
1. **Coluna:** Adicionar `review_notes` (text) e `reviewed_by_id` (integer) na tabela `csat_survey_responses`.

---

## 9. Telefonia & Chamadas de Voz via WebRTC (Twilio Voice)

### O que fazia:
- Criava um softphone WebRTC embutido no painel para realizar e receber ligações telefônicas via Twilio.

### Como recriar no Kallia CRM (Open Source):
1. **Twilio Voice SDK:** Utilizar o SDK `@twilio/voice-sdk` para gerar tokens de sessão (`Twilio::JWT::AccessToken`) no backend Rails e conectar áudio no frontend Vue 3.

---

## 10. Domínios Customizados com SSL Automático

### O que fazia:
- Conectava com a API da Cloudflare for SaaS para criar certificados SSL automáticos quando clientes apontavam um CNAME para a Central de Ajuda.

### Como recriar no Kallia CRM (Open Source):
1. **Na VPS:** Usar o servidor web **Caddy** como proxy reverso frontal (que emite e renova certificados SSL Let's Encrypt automaticamente para qualquer domínio apontado via CNAME sem precisar de API externa).

---

## Conclusão e Próximos Passos
Todas as funcionalidades acima são conceituais e podem ser implementadas do zero no código base padrão MIT, sem nenhuma dependência de bibliotecas ou licenças de terceiros.
