import api from './client';

export const treinoApi = {
  criar: (data: any) => api.post('/treinos', data),
  listar: (params?: any) => api.get('/treinos', { params }),
  atualizar: (id: string, data: any) => api.patch(`/treinos/${id}`, data),
  deletar: (id: string) => api.delete(`/treinos/${id}`),
};
