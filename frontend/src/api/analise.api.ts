import api from './client';

export const analisesApi = {
  estatisticas: () => api.get('/analises/estatisticas'),
  progresso: (exercicio: string, params?: Record<string, unknown>) =>
    api.get(`/analises/progresso/${exercicio}`, { params }),
};
