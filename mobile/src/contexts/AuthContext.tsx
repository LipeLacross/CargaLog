import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth.api';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do AsyncStorage ao montar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuario');
        const token = await AsyncStorage.getItem('token');

        if (usuarioSalvo && token) {
          setUsuario(JSON.parse(usuarioSalvo));
        }
      } catch {
        await AsyncStorage.removeItem('usuario');
        await AsyncStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await authApi.login(email, senha);
      const { token, usuario: usuarioData } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setUsuario(null);
  };

  const registrar = async (nome: string, email: string, senha: string) => {
    try {
      const response = await authApi.registrar({ nome, email, senha });
      const usuarioData = response.data;
      setUsuario(usuarioData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}
