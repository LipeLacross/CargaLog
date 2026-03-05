/**
 * Formata carga removendo decimais desnecessários
 * 54.00 → 54
 * 54.50 → 54.5
 * 54.25 → 54.25
 */
export const formatarCarga = (carga: number): string => {
  return carga % 1 === 0 ? String(carga) : carga.toFixed(1);
};

/**
 * Formata data para formato legível local
 */
export const formatarData = (data: string | Date): string => {
  return new Date(data).toLocaleDateString('pt-BR');
};
