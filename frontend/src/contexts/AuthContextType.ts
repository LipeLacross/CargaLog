import { createContext } from 'react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (
    email: string,
    senha: string,
  ) => Promise<{ token: string; usuario: Usuario }>;
  logout: () => void;
  registrar: (nome: string, email: string, senha: string) => Promise<Usuario>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
