import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchMetadata() {
  const r = await axios.get(`${API_BASE}/metadata`);
  return r.data;
}

export async function predict(features) {
  const r = await axios.post(`${API_BASE}/predict`, { features });
  return r.data;
}

export async function explain(features, method='shap') {
  const r = await axios.post(`${API_BASE}/explain`, { features, method });
  return r.data;
}
