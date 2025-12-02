import { useAuth } from '../../contexts/AuthContext';
import Button from '../Button';
import styles from './Header.module.css';

// ============================================
// COMPONENTE
// ============================================

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo e Nome */}
        <div className={styles.brand}>
          <div className={styles.logo}>🐾</div>
          <div className={styles.brandText}>
            <h1 className={styles.brandName}>AnimalsHotels</h1>
            <p className={styles.brandSubtitle}>Gestão de Tutores</p>
          </div>
        </div>

        {/* Usuário e Logout */}
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.nome}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={logout}
            className={styles.logoutButton}
          >
             Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;