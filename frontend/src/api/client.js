const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // If accessing via local network IP (e.g. phone connected to laptop via Wi-Fi/Hotspot)
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(window.location.hostname)) {
      return `${window.location.protocol}//${window.location.hostname}:8080/api`;
    }
  }
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Native Fetch-based API client with automatic JWT token attachment
 * and Axios-compatible interface (client.get, client.post, res.data, err.response).
 */
const client = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    if (isFormData && headers['Content-Type']) {
      delete headers['Content-Type'];
    }

    let res;
    try {
      res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (networkErr) {
      const error = new Error(`Cannot connect to backend API server at ${API_BASE_URL}. Ensure Spring Boot is running on port 8080.`);
      error.response = {
        status: 0,
        data: {
          message: `Cannot connect to backend API server (${API_BASE_URL}). Please verify your connection.`
        }
      };
      throw error;
    }

    if (res.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const error = new Error(data?.message || `Request failed with status ${res.status}`);
      error.response = { status: res.status, data };
      throw error;
    }

    return { data, status: res.status };
  },

  get(endpoint, options) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  post(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      ...options,
    });
  },

  put(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      ...options,
    });
  },

  patch(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      method: 'PATCH',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      ...options,
    });
  },

  delete(endpoint, options) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  },
};

export default client;
