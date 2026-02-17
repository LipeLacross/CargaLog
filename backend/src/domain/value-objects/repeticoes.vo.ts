/**
 * Value Object Repeticoes
 * Garante que o número de repetições seja válido
 */
export class Repeticoes {
  private readonly valor: number;

  constructor(valor: number) {
    if (!this.validar(valor)) {
      throw new Error('Repetições devem estar entre 1 e 1000');
    }

    this.valor = valor;
  }

  /**
   * Valida se as repetições estão no range válido
   */
  private validar(valor: number): boolean {
    return Number.isInteger(valor) && valor > 0 && valor <= 1000;
  }

  /**
   * Retorna o valor das repetições
   */
  getValor(): number {
    return this.valor;
  }

  /**
   * Verifica se é um treino de força (baixas repetições)
   */
  isForca(): boolean {
    return this.valor <= 5;
  }

  /**
   * Verifica se é um treino de hipertrofia (repetições moderadas)
   */
  isHipertrofia(): boolean {
    return this.valor >= 6 && this.valor <= 12;
  }

  /**
   * Verifica se é um treino de resistência (altas repetições)
   */
  isResistencia(): boolean {
    return this.valor > 12;
  }

  /**
   * Verifica igualdade entre repetições
   */
  equals(other: Repeticoes): boolean {
    return this.valor === other.valor;
  }

  /**
   * Retorna representação em string
   */
  toString(): string {
    return `${this.valor} reps`;
  }
}
