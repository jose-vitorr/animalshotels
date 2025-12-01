import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import type { RegisterCredentials } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './Register.module.css';

// ============================================
// COMPONENTE
// ============================================

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // REACT HOOK FORM
  // ============================================

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterCredentials>();

  // Observar o valor da senha para validar confirmação
  const password = watch('password');

  // ============================================
  // HANDLER: Submit do formulário
  // ============================================

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // Fazer registro (chama função do Context)
      await registerUser(data);

      // Se chegou aqui, registro foi bem-sucedido
      navigate('/dashboard');
    } catch (error: any) {
      // Capturar erro e mostrar mensagem
      setErrorMessage(error.message || 'Erro ao criar conta');
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
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>
            Comece a gerenciar seu hotel pet hoje
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className={styles.error} role="alert">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Nome */}
          <Input
            label="Nome Completo"
            type="text"
            placeholder="João Silva"
            error={errors.nome?.message}
            {...register('nome', {
              required: 'Nome é obrigatório',
              minLength: {
                value: 3,
                message: 'Nome deve ter no mínimo 3 caracteres',
              },
              pattern: {
                value: /^[A-Za-zÀ-ÿ\s]+$/,
                message: 'Nome deve conter apenas letras',
              },
            })}
          />

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
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                message: 'Senha deve conter letras e números',
              },
            })}
          />

          {/* Dicas de Senha */}
          <div className={styles.passwordRequirements}>
            <strong>Sua senha deve ter:</strong>
            <ul>
              <li>No mínimo 6 caracteres</li>
              <li>Pelo menos uma letra</li>
              <li>Pelo menos um número</li>
            </ul>
          </div>

          {/* Campo de Confirmar Senha */}
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirmação de senha é obrigatória',
              validate: (value) =>
                value === password || 'As senhas não coincidem',
            })}
          />

          {/* Botão de Registro */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Criar Conta
          </Button>
        </form>

        {/* Footer - Link para Login */}
        <div className={styles.footer}>
          Já tem uma conta?{' '}
          <Link to="/login" className={styles.link}>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;