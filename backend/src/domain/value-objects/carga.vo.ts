/**
 * Value Object Carga
 * Garante que a carga seja válida e positiva
 */
export class Carga {
  private readonly valor: number;
  private readonly unidade: 'kg' | 'lb';

  constructor(valor: number, unidade: 'kg' | 'lb' = 'kg') {
    if (!this.validar(valor)) {
      throw new Error('Carga deve ser um valor positivo');
    }

    this.valor = valor;
    this.unidade = unidade;
  }

  /**
   * Valida se a carga é positiva
   */
  private validar(valor: number): boolean {
    return valor > 0 && valor <= 10000; // Limite razoável
  }

  /**
   * Retorna o valor da carga
   */
  getValor(): number {
    return this.valor;
  }

  /**
   * Retorna a unidade da carga
   */
  getUnidade(): 'kg' | 'lb' {
    return this.unidade;
  }

  /**
   * Converte para kg (se estiver em lb)
   */
  toKg(): number {
    return this.unidade === 'lb' ? this.valor * 0.453592 : this.valor;
  }

  /**
   * Converte para lb (se estiver em kg)
   */
  toLb(): number {
    return this.unidade === 'kg' ? this.valor * 2.20462 : this.valor;
  }

  /**
   * Verifica igualdade entre cargas
   */
  equals(other: Carga): boolean {
    return this.toKg() === other.toKg();
  }

  /**
   * Compara se é maior que outra carga
   */
  isGreaterThan(other: Carga): boolean {
    return this.toKg() > other.toKg();
  }

  /**
   * Retorna representação em string
   */
  toString(): string {
    return `${this.valor} ${this.unidade}`;
  }
}
