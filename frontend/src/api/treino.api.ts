import api from './client';
interface CreateTreinoData {
  exercicioNome: string;
  carga: number;
  repeticoes: number;
  data?: string;
}

interface UpdateTreinoData {
  exercicioNome?: string;
  carga?: number;
  repeticoes?: number;
  data?: string;
}

export const treinoApi = {
  criar: (data: CreateTreinoData) => api.post('/treinos', data),
  listar: (params?: Record<string, unknown>) => api.get('/treinos', { params }),
  atualizar: (id: string, data: UpdateTreinoData) => api.patch(`/treinos/${id}`, data),
  deletar: (id: string) => api.delete(`/treinos/${id}`),
};
