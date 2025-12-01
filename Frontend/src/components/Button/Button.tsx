import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

// ============================================
// TIPOS
// ============================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;                          // Conteúdo do botão
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'; // Estilo
  size?: 'small' | 'medium' | 'large';         // Tamanho
  fullWidth?: boolean;                          // Largura total?
  isLoading?: boolean;                          // Mostra loading?
}

// ============================================
// COMPONENTE
// ============================================

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps) => {
  // Montar classes CSS dinamicamente
  const buttonClasses = [
    styles.button,                    // Classe base
    styles[variant],                  // Variante (primary, secondary, etc)
    size !== 'medium' && styles[size], // Tamanho (só se não for medium)
    fullWidth && styles.fullWidth,    // Largura total
    className,                        // Classes extras
  ]
    .filter(Boolean)  // Remove valores false/undefined
    .join(' ');       // Junta tudo em uma string

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <span>⏳</span>
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;