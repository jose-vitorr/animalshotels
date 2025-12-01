import axios from 'axios';

// URL base da API (vamos mudar depois quando criarmos a API)
const API_URL = 'http://localhost:3000';

// Criar instância do axios com configurações padrão
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;