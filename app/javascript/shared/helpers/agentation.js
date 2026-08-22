let agentationRoot = null;

export const isAgentationEnabled = () => {
  if (typeof window === 'undefined') return false;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('agentation') === 'true') {
      localStorage.setItem('ENABLE_AGENTATION', 'true');
      return true;
    }
    if (urlParams.get('agentation') === 'false') {
      localStorage.setItem('ENABLE_AGENTATION', 'false');
      return false;
    }
  } catch (e) {
    // Ignore URL/localStorage access errors
  }

  try {
    if (localStorage.getItem('ENABLE_AGENTATION') === 'true') {
      return true;
    }
    if (localStorage.getItem('ENABLE_AGENTATION') === 'false') {
      return false;
    }
  } catch (e) {
    // Ignore localStorage access errors
  }

  return Boolean(
    window.chatwootConfig?.enableAgentation === 'true' ||
      window.chatwootConfig?.enableAgentation === true
  );
};

export const mountAgentation = async () => {
  if (typeof window === 'undefined') return;
  if (agentationRoot) return;

  try {
    const [React, ReactDOM, { Agentation }] = await Promise.all([
      import('react'),
      import('react-dom/client'),
      import('agentation'),
    ]);

    let container = document.getElementById('agentation-mount-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'agentation-mount-root';
      document.body.appendChild(container);
    }

    const endpoint = window.chatwootConfig?.agentationEndpoint || undefined;
    const sessionId = window.chatwootConfig?.agentationSessionId || undefined;

    agentationRoot = ReactDOM.createRoot(container);
    agentationRoot.render(
      React.createElement(Agentation, {
        endpoint,
        sessionId,
      })
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Agentation] Failed to initialize:', error);
  }
};

export const unmountAgentation = () => {
  if (agentationRoot) {
    agentationRoot.unmount();
    agentationRoot = null;
    const container = document.getElementById('agentation-mount-root');
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};

export const toggleAgentation = enable => {
  const nextState =
    typeof enable === 'boolean' ? enable : !isAgentationEnabled();
  try {
    localStorage.setItem('ENABLE_AGENTATION', nextState ? 'true' : 'false');
  } catch (e) {
    // Ignore localStorage errors
  }

  if (nextState) {
    mountAgentation();
  } else {
    unmountAgentation();
  }
  return nextState;
};

export const initializeAgentation = () => {
  if (typeof window === 'undefined') return;

  // Expose global helper for VPS production toggling via console/browser
  window.AgentationManager = {
    enable: () => toggleAgentation(true),
    disable: () => toggleAgentation(false),
    toggle: () => toggleAgentation(),
    isEnabled: isAgentationEnabled,
  };
  window.toggleAgentation = window.AgentationManager.toggle;

  if (isAgentationEnabled()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => mountAgentation(), {
        once: true,
      });
    } else {
      mountAgentation();
    }
  }
};

export default initializeAgentation;
