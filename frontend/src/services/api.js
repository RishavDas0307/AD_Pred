// Centralized API Base URL configuration using Vite environment variable with local fallback
const API_URL = import.meta.env.VITE_API_URL;
export const API_BASE = (API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const isLocalhostTarget = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');
export const isRunningOnProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

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
      throw new Error(`Request timed out after ${timeoutMs / 1000}s. If the backend is hosted on Render free tier, it takes ~30-50s to wake from sleep. Please wait a moment and retry.`);
    }
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))) {
      if (isRunningOnProduction && isLocalhostTarget) {
        throw new Error(`Frontend is deployed at ${window.location.hostname} but attempting to reach ${API_BASE}. Please set VITE_API_URL in your Vercel project environment variables to your Render backend URL.`);
      }
      throw new Error(`Unable to reach backend API at ${API_BASE}. If using Render free tier, the instance may be starting up. Please check CORS and server status.`);
    }
    throw err;
  }
}

export const api = {
  async checkHealth(timeoutMs = 8000) {
    try {
      return await request('/health', { timeout: timeoutMs });
    } catch (e) {
      return { status: 'offline', error: e.message };
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

