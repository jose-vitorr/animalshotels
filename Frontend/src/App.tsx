import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Tutores from './pages/Tutores';


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
              <Tutores />
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