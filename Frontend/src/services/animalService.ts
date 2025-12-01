import api from './api';
import type { Animal } from '../types';

// ============================================
// FUNÇÕES DO SERVIÇO DE ANIMAIS
// ============================================

// Buscar todos os animais
export const getAnimais = async (): Promise<Animal[]> => {
  const response = await api.get('/animais');
  return response.data;
};

// Buscar animais de um tutor específico
export const getAnimaisByTutor = async (tutorId: string): Promise<Animal[]> => {
  const response = await api.get(`/animais?tutorId=${tutorId}`);
  return response.data;
};

// Buscar animal por ID
export const getAnimalById = async (id: string): Promise<Animal> => {
  const response = await api.get(`/animais/${id}`);
  return response.data;
};

// Criar novo animal
export const createAnimal = async (animal: Omit<Animal, 'id'>): Promise<Animal> => {
  const response = await api.post('/animais', animal);
  return response.data;
};

// Atualizar animal
export const updateAnimal = async (id: string, animal: Partial<Animal>): Promise<Animal> => {
  const response = await api.put(`/animais/${id}`, animal);
  return response.data;
};

// Deletar animal
export const deleteAnimal = async (id: string): Promise<void> => {
  await api.delete(`/animais/${id}`);
};

// Deletar todos os animais de um tutor
export const deleteAnimaisByTutor = async (tutorId: string): Promise<void> => {
  const animais = await getAnimaisByTutor(tutorId);
  
  // Deletar cada animal
  await Promise.all(animais.map((animal) => deleteAnimal(animal.id)));
};