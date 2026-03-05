import { createContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';
interface Usuario {
  id: string;
  nome: string;
  email: string;
}
interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<any>;
  logout: () => void;
  registrar: (nome: string, email: string, senha: string) => Promise<any>;
}
export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioStored = localStorage.getItem('usuario');
    if (token && usuarioStored) {
      try {
        setUsuario(JSON.parse(usuarioStored));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);
  const login = async (email: string, senha: string) => {
    const res = await authApi.login(email, senha);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
    setUsuario(res.data.usuario);
    return res.data;
  };
  const registrar = async (nome: string, email: string, senha: string) => {
    const res = await authApi.registrar({ nome, email, senha });
    return res.data;
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };
  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}
