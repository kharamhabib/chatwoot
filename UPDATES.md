# Implementation Updates & Roadmap

Control of implementations and features with status and dates.

## [2026-08-22] Integrations & AI Tooling

- [x] **Agentation Integration (Development & Production on VPS)** - *2026-08-22*
  - Installed `agentation`, `react`, and `react-dom`.
  - Created lazy-loader in `app/javascript/shared/helpers/agentation.js` to ensure zero performance overhead when disabled.
  - Added environment variable support (`ENABLE_AGENTATION` and `AGENTATION_ENDPOINT`) in `.env.example` and `app/views/layouts/vueapp.html.erb`.
  - Added URL parameter (`?agentation=true` / `?agentation=false`) and runtime browser console controls (`window.AgentationManager.enable()`, `window.toggleAgentation()`) for on-demand activation in VPS production environments.
