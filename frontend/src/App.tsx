import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Treinos } from './pages/Treinos';
import { CreateTreino } from './pages/Treinos/Create';
import { EditTreino } from './pages/Treinos/Edit';
import { Analises } from './pages/Analises';
import { Perfil } from './pages/Perfil';
import { EsqueciSenha } from './pages/EsqueciSenha';
import { ResetSenha } from './pages/ResetSenha';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { usuario, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return usuario ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/reset-password" element={<ResetSenha />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/treinos"
        element={
          <ProtectedRoute>
            <Treinos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treinos/novo"
        element={
          <ProtectedRoute>
            <CreateTreino />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treinos/editar/:id"
        element={
          <ProtectedRoute>
            <EditTreino />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analises"
        element={
          <ProtectedRoute>
            <Analises />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
export default App;
