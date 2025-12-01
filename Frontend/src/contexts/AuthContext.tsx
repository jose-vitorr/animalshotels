import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginCredentials, RegisterCredentials } from '../types';
import { authReducer, initialAuthState } from './authReducer';
import api from '../services/api';

// Criar o Context (a "caixa mágica")
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider: componente que envolve a aplicação e fornece o context
interface AuthProviderProps {
  children: ReactNode; // Componentes filhos
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // useReducer: gerencia o estado complexo de autenticação
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // ============================================
  // EFEITO: Verificar se já existe token salvo
  // ============================================
  useEffect(() => {
    const checkAuth = () => {
      // Buscar token salvo no localStorage
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        // Se existir, restaurar sessão
        const user = JSON.parse(userStr);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } else {
        // Se não existir, apenas para o loading
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []); // [] = executa apenas uma vez quando componente monta

  // ============================================
  // FUNÇÃO: Login
  // ============================================
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Fazer requisição para API
      const response = await api.post('/auth/login', credentials);

      const { user, token } = response.data;

      // Salvar no localStorage (persiste após fechar navegador)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar estado
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Lançar erro para o componente tratar
      throw new Error(
        error.response?.data?.message || 'Erro ao fazer login'
      );
    }
  };

  // ============================================
  // FUNÇÃO: Registro
  // ============================================
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Validar se senhas coincidem
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Fazer requisição para API
      const response = await api.post('/auth/register', {
        nome: credentials.nome,
        email: credentials.email,
        password: credentials.password,
      });

      const { user, token } = response.data;

      // Salvar no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualizar estado
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      throw new Error(
        error.response?.data?.message || 'Erro ao criar conta'
      );
    }
  };

  // ============================================
  // FUNÇÃO: Logout
  // ============================================
  const logout = () => {
    // Remover dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Atualizar estado
    dispatch({ type: 'LOGOUT' });
  };

  // ============================================
  // Valor do Context (o que é compartilhado)
  // ============================================
  const value: AuthContextType = {
    ...state,      // user, token, isAuthenticated, isLoading
    login,         // Função de login
    register,      // Função de registro
    logout,        // Função de logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// Hook customizado para usar o Context
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
};