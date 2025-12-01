import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import Modal from './components/Modal';

// ============================================
// COMPONENTES TEMPORÁRIOS (vamos criar depois)
// ============================================

// Componente temporário de Login
const Login = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>🔐 Página de Login</h1>
      <p>Vamos criar essa página no próximo passo!</p>
    </div>
  );
};

// Componente temporário de Registro
const Register = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>📝 Página de Registro</h1>
      <p>Vamos criar essa página no próximo passo!</p>
    </div>
  );
};

// Componente temporário de Dashboard (Tutores) - ATUALIZADO
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleTestInput = () => {
    if (!inputValue) {
      setInputError('Este campo é obrigatório');
    } else {
      setInputError('');
      alert(`Valor digitado: ${inputValue}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 Teste dos Componentes</h1>
      <p>Usuário: <strong>{user?.nome}</strong></p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>
        
        {/* Teste de Botões */}
        <section>
          <h2>Botões</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" size="small">Small</Button>
            <Button variant="primary" size="large">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Teste de Inputs */}
        <section>
          <h2>Inputs</h2>
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            error={inputError}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            helperText="Usaremos para entrar em contato"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
          />
          <Button onClick={handleTestInput} style={{ marginTop: '10px' }}>
            Testar Validação
          </Button>
        </section>

        {/* Teste de Modal */}
        <section>
          <h2>Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            Abrir Modal
          </Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Teste de Modal"
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirmar
                </Button>
              </>
            }
          >
            <p>Este é o conteúdo do modal!</p>
            <p>Você pode clicar fora, apertar ESC ou clicar no X para fechar.</p>
          </Modal>
        </section>

        {/* Botão de Logout */}
        <section>
          <Button variant="danger" onClick={logout}>
            🚪 Fazer Logout
          </Button>
        </section>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE DE ROTA PROTEGIDA
// ============================================

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Componente que protege rotas (só usuários logados podem acessar)
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Enquanto verifica se está logado, mostra loading
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>⏳ Carregando...</h2>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não estiver logado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, mostra o conteúdo
  return <>{children}</>;
};

// ============================================
// COMPONENTE PRINCIPAL - APP
// ============================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================ */}
        {/* ROTAS PÚBLICAS (qualquer um pode acessar)   */}
        {/* ============================================ */}
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ============================================ */}
        {/* ROTAS PRIVADAS (só quem está logado)        */}
        {/* ============================================ */}
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ============================================ */}
        {/* ROTA PADRÃO (redireciona para dashboard)    */}
        {/* ============================================ */}
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ============================================ */}
        {/* ROTA 404 (página não encontrada)            */}
        {/* ============================================ */}
        
        <Route
          path="*"
          element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h1>404</h1>
              <p>Página não encontrada</p>
              <a href="/dashboard" style={{ color: '#3ECF8E' }}>
                Voltar para o início
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;