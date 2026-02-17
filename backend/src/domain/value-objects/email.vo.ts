/**
 * Value Object Email
 * Garante que o email seja válido e normalizado
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    const normalizado = this.normalizar(email);

    if (!this.validar(normalizado)) {
      throw new Error('Email inválido');
    }

    this.value = normalizado;
  }

  /**
   * Normaliza o email (lowercase e trim)
   */
  private normalizar(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Valida o formato do email
   */
  private validar(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Retorna o valor do email
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Verifica igualdade entre emails
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * Retorna representação em string
   */
  toString(): string {
    return this.value;
  }
}
