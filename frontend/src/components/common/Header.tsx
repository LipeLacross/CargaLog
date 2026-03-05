import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Dumbbell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo com ícone */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-white hover:scale-105 transition-transform"
        >
          <Dumbbell className="w-7 h-7 animate-bounce" />
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            CargaLog
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/dashboard" className="text-white hover:text-blue-100 transition-colors font-medium">
            Dashboard
          </Link>
          <Link to="/treinos" className="text-white hover:text-blue-100 transition-colors font-medium">
            Treinos
          </Link>
          <Link to="/analises" className="text-white hover:text-blue-100 transition-colors font-medium">
            Análises
          </Link>

          {/* User Info e Logout */}
          <div className="flex items-center gap-4 pl-8 border-l border-blue-400">
            <span className="text-white text-sm font-medium">{usuario?.nome || 'Usuário'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </nav>

        {/* Menu Mobile Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-2 animate-in border-t border-blue-600">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
          >
            Dashboard
          </Link>
          <Link
            to="/treinos"
            onClick={() => setMenuOpen(false)}
            className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
          >
            Treinos
          </Link>
          <Link
            to="/analises"
            onClick={() => setMenuOpen(false)}
            className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
          >
            Análises
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="block w-full text-left text-red-200 hover:bg-blue-600 px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </header>
  );
}