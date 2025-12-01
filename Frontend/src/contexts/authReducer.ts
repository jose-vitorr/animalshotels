import type { AuthState, AuthAction } from '../types';

// Estado inicial quando o app carrega
export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Começa como true enquanto verifica se há token salvo
};

// Reducer: função que recebe estado atual e ação, retorna novo estado
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // Quando login for bem-sucedido
      return {
        ...state,                          // Mantém o resto do estado
        user: action.payload.user,         // Salva o usuário
        token: action.payload.token,       // Salva o token
        isAuthenticated: true,             // Marca como autenticado
        isLoading: false,                  // Para de carregar
      };

    case 'LOGOUT':
      // Quando usuário fizer logout
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'SET_LOADING':
      // Para controlar o estado de carregamento
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      // Se a ação não for reconhecida, retorna estado sem mudanças
      return state;
  }
};