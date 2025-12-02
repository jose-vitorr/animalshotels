import type { Tutor, Animal } from '../../types';
import Button from '../Button';
import styles from './TutorCard.module.css';

// ============================================
// TIPOS
// ============================================

interface TutorCardProps {
  tutor: Tutor;
  animais: Animal[];
  onEdit: (tutor: Tutor) => void;
  onDelete: (tutor: Tutor) => void;
}

// ============================================
// COMPONENTE
// ============================================

const TutorCard = ({ tutor, animais, onEdit, onDelete }: TutorCardProps) => {
  return (
    <div className={styles.card}>
      {/* Header com Nome */}
      <div className={styles.header}>
        <h3 className={styles.name}>{tutor.nome}</h3>
      </div>

      {/* Informações de Contato */}
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.icon}>✉️</span>
          <span>{tutor.email}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.icon}>📱</span>
          <span>{tutor.telefone}</span>
        </div>
      </div>

      {/* Seção de Animais */}
      <div className={styles.animaisSection}>
        <div className={styles.animaisHeader}>
          <span>🐾</span>
          <span>{animais.length} {animais.length === 1 ? 'Animal' : 'Animais'}</span>
        </div>

        {animais.length > 0 ? (
          <div className={styles.animaisList}>
            {animais.map((animal) => (
              <div key={animal.id} className={styles.animalItem}>
                <div className={styles.animalName}>{animal.nome}</div>
                <div className={styles.animalDetails}>
                  {animal.especie} • {animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyAnimais}>
            Nenhum animal cadastrado
          </div>
        )}
      </div>

      {/* Ações */}
      <div className={styles.actions}>
        <Button
          variant="outline"
          size="small"
          onClick={() => onEdit(tutor)}
          style={{ flex: 1 }}
        >
           Editar
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(tutor)}
          style={{ flex: 1 }}
        >
           Excluir
        </Button>
      </div>
    </div>
  );
};

export default TutorCard;