import api from './api';
import type { Tutor } from '../types';

// ============================================
// FUNÇÕES DO SERVIÇO DE TUTORES
// ============================================

// Buscar todos os tutores
export const getTutores = async (): Promise<Tutor[]> => {
  const response = await api.get('/tutores');
  return response.data;
};

// Buscar tutor por ID
export const getTutorById = async (id: string): Promise<Tutor> => {
  const response = await api.get(`/tutores/${id}`);
  return response.data;
};

// Criar novo tutor
export const createTutor = async (tutor: Omit<Tutor, 'id'>): Promise<Tutor> => {
  const response = await api.post('/tutores', tutor);
  return response.data;
};

// Atualizar tutor
export const updateTutor = async (id: string, tutor: Partial<Tutor>): Promise<Tutor> => {
  const response = await api.put(`/tutores/${id}`, tutor);
  return response.data;
};

// Deletar tutor
export const deleteTutor = async (id: string): Promise<void> => {
  await api.delete(`/tutores/${id}`);
};