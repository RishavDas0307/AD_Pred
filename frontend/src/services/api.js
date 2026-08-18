// Centralized API Base URL configuration using Vite environment variable with local fallback
const API_URL = import.meta.env.VITE_API_URL;
export const API_BASE = (API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const DEFAULT_TIMEOUT_MS = 30000;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const timeoutMs = options.timeout ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorDetail = `HTTP Error ${res.status}: ${res.statusText || 'Server Error'}`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          if (Array.isArray(errJson.detail)) {
            errorDetail = errJson.detail.map(d => `${d.loc ? d.loc.join('.') + ': ' : ''}${d.msg}`).join(', ');
          } else {
            errorDetail = String(errJson.detail);
          }
        } else if (errJson.message) {
          errorDetail = String(errJson.message);
        }
      } catch {
        // Non-JSON response body
      }
      throw new Error(errorDetail);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s. If the backend is hosted on a free tier (such as Render), it may take 30-50s to spin up from sleep. Please retry in a few moments.`);
    }
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))) {
      throw new Error(`Unable to reach backend API at ${API_BASE}. Please check server health or verify network/CORS configuration.`);
    }
    throw err;
  }
}

export const api = {
  async checkHealth() {
    try {
      return await request('/health', { timeout: 4000 });
    } catch {
      return { status: 'offline' };
    }
  },

  async getModels() {
    try {
      const data = await request('/models', { timeout: 5000 });
      return data.models || ['random_forest', 'xgboost', 'svm', 'logistic_regression'];
    } catch (e) {
      console.warn('Using fallback model list', e);
      return ['random_forest', 'xgboost', 'svm', 'logistic_regression'];
    }
  },

  async predictSingle(model, features) {
    return await request('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, features })
    });
  },

  async predictAll(features) {
    return await request('/predict/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'random_forest', features })
    });
  },

  async getExplanation(model, features) {
    return await request('/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, features })
    });
  },

  async getEvaluationMetrics() {
    return await request('/evaluation/metrics');
  },

  async getDatasetSummary() {
    return await request('/dataset/summary');
  },

  async getDatasetFeatures() {
    return await request('/dataset/features');
  }
};

