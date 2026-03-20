import api from './client';

export const analisesApi = {
  estatisticas: () => api.get('/analises/estatisticas'),
  relatorioProgresso: (
    exercicio: string,
    periodoInicio: string,
    periodoFim: string,
  ) =>
    api.get('/analises/relatorio-progresso', {
      params: { exercicio, periodoInicio, periodoFim },
    }),
};
