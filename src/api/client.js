/**
 * Cliente HTTP centralizado usando axios.
 * Lee la URL base desde Vite env (VITE_API_URL).
 */
import axios from 'axios';

// En desarrollo usamos el proxy de Vite por defecto (baseURL vacío) para evitar
// CORS. Solo iremos directo al backend si VITE_USE_PROXY=false. En build usamos
// la URL configurada o localhost.
const useProxy = import.meta.env.DEV && import.meta.env.VITE_USE_PROXY !== 'false';
const baseURL = useProxy
  ? ''
  : (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:8000'));

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default api;
