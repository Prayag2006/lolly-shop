// Attaches the signed session token (issued by the server on login) to every same-origin
// /api/ request, so the server can verify who is actually calling instead of trusting
// client-supplied role/permission headers. Imported once at app startup (see main.jsx).
//
// The token itself is read from localStorage at call time (not from React state) so this
// works for every fetch call in the app — including ones outside StoreContext — without
// needing to be re-initialized on every render.

const TOKEN_KEY = 'hc_token';

let patched = false;

export const installApiAuthInterceptor = () => {
  if (patched || typeof window === 'undefined' || !window.fetch) return;
  patched = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init = {}) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.startsWith('/api/')) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        return originalFetch(input, {
          ...init,
          headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    return originalFetch(input, init);
  };
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
