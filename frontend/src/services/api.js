const API_BASE = 'http://localhost:8000';

async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        if (Array.isArray(errJson.detail)) {
          errorDetail = errJson.detail.map(d => `${d.loc?.join('.')} - ${d.msg}`).join(', ');
        } else {
          errorDetail = errJson.detail;
        }
      }
    } catch {
      // Ignored
    }
    throw new Error(errorDetail);
  }
  return await res.json();
}

export const api = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return await handleResponse(res);
    } catch {
      return { status: 'offline' };
    }
  },

  async getModels() {
    try {
      const res = await fetch(`${API_BASE}/models`);
      const data = await handleResponse(res);
      return data.models || ['random_forest', 'xgboost', 'svm', 'logistic_regression'];
    } catch (e) {
      console.warn('Using fallback model list', e);
      return ['random_forest', 'xgboost', 'svm', 'logistic_regression'];
    }
  },

  async predictSingle(model, features) {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, features })
    });
    return await handleResponse(res);
  },

  async predictAll(features) {
    const res = await fetch(`${API_BASE}/predict/all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'random_forest', features })
    });
    return await handleResponse(res);
  },

  async getExplanation(model, features) {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, features })
    });
    return await handleResponse(res);
  },

  async getEvaluationMetrics() {
    const res = await fetch(`${API_BASE}/evaluation/metrics`);
    return await handleResponse(res);
  },

  async getDatasetSummary() {
    const res = await fetch(`${API_BASE}/dataset/summary`);
    return await handleResponse(res);
  },

  async getDatasetFeatures() {
    const res = await fetch(`${API_BASE}/dataset/features`);
    return await handleResponse(res);
  }
};
