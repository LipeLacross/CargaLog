export const formatarCarga = (carga: number): string => {
  return carga % 1 === 0 ? String(carga) : carga.toFixed(1);
};

export const formatarData = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatarDataBR = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR');
};
