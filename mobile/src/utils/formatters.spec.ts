import { formatarCarga, formatarData, formatarDataBR } from './formatters';

describe('formatarCarga', () => {
  it('deve remover decimais quando valor é inteiro', () => {
    expect(formatarCarga(54)).toBe('54');
    expect(formatarCarga(100)).toBe('100');
    expect(formatarCarga(0)).toBe('0');
  });

  it('deve manter um decimal quando necessário', () => {
    expect(formatarCarga(54.5)).toBe('54.5');
    expect(formatarCarga(10.1)).toBe('10.1');
  });

  it('deve arredondar para um decimal', () => {
    expect(formatarCarga(54.25)).toBe('54.3');
    expect(formatarCarga(99.99)).toBe('100.0');
  });

  it('deve formatar decimais .00 como inteiro', () => {
    expect(formatarCarga(80.0)).toBe('80');
    expect(formatarCarga(20.0)).toBe('20');
  });
});

describe('formatarData', () => {
  it('deve formatar data no padrão brasileiro', () => {
    const result = formatarData(new Date(2026, 0, 15).toISOString());
    expect(result).toMatch(/15\/01\/2026/);
  });

  it('deve formatar data com zeros à esquerda', () => {
    const result = formatarData(new Date(2026, 4, 1).toISOString());
    expect(result).toMatch(/01\/05\/2026/);
  });

  it('deve formatar data de fim de ano', () => {
    const result = formatarData(new Date(2026, 11, 31).toISOString());
    expect(result).toMatch(/31\/12\/2026/);
  });
});

describe('formatarDataBR', () => {
  it('deve formatar data no padrão brasileiro simples', () => {
    const result = formatarDataBR(new Date(2026, 2, 20).toISOString());
    expect(result).toMatch(/20\/03\/2026/);
  });
});
