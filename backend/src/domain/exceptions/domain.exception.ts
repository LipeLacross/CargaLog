/**
 * Exceção base de domínio
 * Representa erros relacionados às regras de negócio
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Exceção lançada quando um usuário não é encontrado
 */
export class UsuarioNaoEncontradoException extends DomainException {
  constructor(identificador: string) {
    super(`Usuário '${identificador}' não encontrado`);
    this.name = 'UsuarioNaoEncontradoException';
  }
}

/**
 * Exceção lançada quando um email já está em uso
 */
export class EmailJaExisteException extends DomainException {
  constructor(email: string) {
    super(`Email '${email}' já está cadastrado`);
    this.name = 'EmailJaExisteException';
  }
}

/**
 * Exceção lançada quando credenciais são inválidas
 */
export class CredenciaisInvalidasException extends DomainException {
  constructor() {
    super('Email ou senha inválidos');
    this.name = 'CredenciaisInvalidasException';
  }
}

/**
 * Exceção lançada quando um treino não é encontrado
 */
export class TreinoNaoEncontradoException extends DomainException {
  constructor(id: string) {
    super(`Treino com ID '${id}' não encontrado`);
    this.name = 'TreinoNaoEncontradoException';
  }
}

/**
 * Exceção lançada quando um usuário não tem permissão
 */
export class PermissaoNegadaException extends DomainException {
  constructor(acao: string) {
    super(`Você não tem permissão para ${acao}`);
    this.name = 'PermissaoNegadaException';
  }
}

/**
 * Exceção lançada quando dados inválidos são fornecidos
 */
export class DadosInvalidosException extends DomainException {
  constructor(campo: string, motivo: string) {
    super(`Campo '${campo}' inválido: ${motivo}`);
    this.name = 'DadosInvalidosException';
  }
}

/**
 * Exceção lançada quando uma análise não pode ser gerada
 */
export class AnaliseIndisponivelException extends DomainException {
  constructor(motivo: string) {
    super(`Análise indisponível: ${motivo}`);
    this.name = 'AnaliseIndisponivelException';
  }
}

