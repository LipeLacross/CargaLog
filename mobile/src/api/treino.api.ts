import api from './client';

export const treinoApi = {
  criar: (data: { exercicioNome: string; carga: number; repeticoes: number; data: string }) =>
    api.post('/treinos', data),
  listar: (params?: Record<string, unknown>) =>
    api.get('/treinos', { params }),
  atualizar: (id: string, data: { exercicioNome?: string; carga?: number; repeticoes?: number; data?: string }) =>
    api.patch(`/treinos/${id}`, data),
  deletar: (id: string) =>
    api.delete(`/treinos/${id}`),
};

