import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-100">
          CargaLog
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/dashboard" className="hover:text-blue-100 transition-colors">
            Dashboard
          </Link>
          <Link to="/treinos" className="hover:text-blue-100 transition-colors">
            Treinos
          </Link>
          <Link to="/analises" className="hover:text-blue-100 transition-colors">
            Analises
          </Link>
          <span className="text-sm">{usuario?.nome || 'Usuario'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <span className="text-sm">{usuario?.nome || 'Usuario'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
      <nav className="md:hidden bg-blue-700 px-4 py-2 flex gap-4 text-sm overflow-x-auto">
        <Link to="/dashboard" className="hover:text-blue-100 transition-colors whitespace-nowrap">
          Dashboard
        </Link>
        <Link to="/treinos" className="hover:text-blue-100 transition-colors whitespace-nowrap">
          Treinos
        </Link>
        <Link to="/analises" className="hover:text-blue-100 transition-colors whitespace-nowrap">
          Analises
        </Link>
      </nav>
    </header>
  );
}