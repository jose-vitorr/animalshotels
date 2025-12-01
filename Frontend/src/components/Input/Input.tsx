import  {  forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

// ============================================
// TIPOS
// ============================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;           // Texto acima do input
  error?: string;           // Mensagem de erro
  helperText?: string;      // Texto de ajuda
  required?: boolean;       // Campo obrigatório?
}

// ============================================
// COMPONENTE
// ============================================

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    // Gerar ID único se não foi fornecido
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={styles.container}>
        {/* Label (se existir) */}
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Input */}
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            className={`${styles.input} ${error ? styles.error : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...rest}
          />
        </div>

        {/* Mensagem de erro */}
        {error && (
          <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}

        {/* Texto de ajuda */}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;