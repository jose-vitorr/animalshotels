import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginCredentials } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './Login.module.css';

// ============================================
// COMPONENTE
// ============================================

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // REACT HOOK FORM
  // ============================================
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  // ============================================
  // HANDLER: Submit do formulário
  // ============================================
  
  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      setErrorMessage(''); // Limpar erro anterior

      // Fazer login (chama função do Context)
      await login(data);

      // Se chegou aqui, login foi bem-sucedido
      navigate('/dashboard');
    } catch (error: any) {
      // Capturar erro e mostrar mensagem
      setErrorMessage(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo e Título */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>🐾</div>
          <h1 className={styles.title}>AnimalsHotels</h1>
          <p className={styles.subtitle}>Gerencie seu hotel pet com carinho</p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className={styles.error} role="alert">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Email */}
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
          />

          {/* Campo de Senha */}
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Senha deve ter no mínimo 6 caracteres',
              },
            })}
          />

          {/* Link "Esqueceu a senha?" */}
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password" className={styles.link}>
              Esqueceu a senha?
            </Link>
          </div>

          {/* Botão de Login */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </form>

        {/* Footer - Link para Registro */}
        <div className={styles.footer}>
          Não tem uma conta?{' '}
          <Link to="/register" className={styles.link}>
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;