import api from './client';
export const authApi = {
  registrar: (data: { nome: string; email: string; senha: string }) =>
    api.post('/auth/registrar', data),
  login: (email: string, senha: string) =>
    api.post('/auth/login', { email, senha }),
  perfil: () => api.get('/auth/perfil'),
};
