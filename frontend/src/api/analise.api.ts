import api from './client';

export const analisesApi = {
  estatisticas: () => api.get('/analises/estatisticas'),
  progresso: (exercicio: string, params?: any) =>
    api.get(`/analises/progresso/${exercicio}`, { params }),
};
