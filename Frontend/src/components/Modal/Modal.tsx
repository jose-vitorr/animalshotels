import { useEffect } from 'react';
import type { ReactNode  } from 'react';
import styles from './Modal.module.css';

// ============================================
// TIPOS
// ============================================

interface ModalProps {
  isOpen: boolean;              // Modal está aberto?
  onClose: () => void;          // Função para fechar
  title?: string;               // Título do modal
  children: ReactNode;          // Conteúdo do modal
  footer?: ReactNode;           // Rodapé com botões
  showCloseButton?: boolean;    // Mostrar X para fechar?
}

// ============================================
// COMPONENTE
// ============================================

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
}: ModalProps) => {
  // ============================================
  // EFEITO: Bloquear scroll quando modal abrir
  // ============================================
  useEffect(() => {
    if (isOpen) {
      // Salvar scroll atual
      const scrollY = window.scrollY;
      
      // Bloquear scroll do body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // Cleanup: restaurar scroll quando fechar
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // ============================================
  // EFEITO: Fechar com tecla ESC
  // ============================================
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // ============================================
  // HANDLER: Fechar ao clicar no overlay
  // ============================================
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Só fecha se clicar diretamente no overlay (não no modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Fechar modal"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;