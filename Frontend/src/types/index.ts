// ============================================
// TIPOS DE ENTIDADES
// ============================================

// Tipo para o Tutor
export interface Tutor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

// Tipo para o Animal
export interface Animal {
  id: string;
  nome: string;
  especie: 'gato' | 'cachorro'; // Só pode ser um desses dois
  raca: string;
  idade: number;
  tutorId: string; // Referência ao tutor
  foto?: string; // Opcional (?)
}

// ============================================
// TIPOS DE AUTENTICAÇÃO
// ============================================

// Tipo para o usuário logado
export interface User {
  id: string;
  nome: string;
  email: string;
}

// Tipo para credenciais de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipo para credenciais de registro
export interface RegisterCredentials {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tipo para resposta da API de login
export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// TIPOS DO CONTEXT DE AUTENTICAÇÃO
// ============================================

// Estado da autenticação
export interface AuthState {
  user: User | null;           // Usuário logado (null se não estiver logado)
  token: string | null;         // Token JWT
  isAuthenticated: boolean;     // true se estiver logado
  isLoading: boolean;           // true enquanto verifica autenticação
}

// Ações possíveis no reducer
export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Contexto de autenticação (funções disponíveis)
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}