import api from './client';

export const authApi = {
  registrar: (data: { nome: string; email: string; senha: string }) =>
    api.post('/auth/registrar', data),
  login: (email: string, senha: string) =>
    api.post('/auth/login', { email, senha }),
  perfil: () => api.get('/auth/perfil'),
  atualizarPerfil: (data: {
    nome?: string;
    senhaAtual?: string;
    novaSenha?: string;
  }) => api.patch('/auth/perfil', data),
  esqueciSenha: (data: { email: string }) =>
    api.post('/auth/esqueci-senha', data),
  confirmarResetSenha: (data: { token: string; novaSenha: string }) =>
    api.post('/auth/confirmar-reset-senha', data),
};
