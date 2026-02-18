import {
  DomainException,
  UsuarioNaoEncontradoException,
  EmailJaExisteException,
  CredenciaisInvalidasException,
  TreinoNaoEncontradoException,
  PermissaoNegadaException,
  DadosInvalidosException,
  AnaliseIndisponivelException,
} from './domain.exception';

describe('Domain Exceptions', () => {
  describe('DomainException (Base)', () => {
    it('deve criar exceção de domínio com mensagem', () => {
      // Arrange & Act
      const exception = new DomainException('Erro de domínio genérico');

      // Assert
      expect(exception).toBeInstanceOf(Error);
      expect(exception.message).toBe('Erro de domínio genérico');
      expect(exception.name).toBe('DomainException');
    });

    it('deve ter stack trace capturado', () => {
      // Arrange & Act
      const exception = new DomainException('Teste de stack');

      // Assert
      expect(exception.stack).toBeDefined();
      expect(exception.stack).toContain('DomainException');
    });
  });

  describe('UsuarioNaoEncontradoException', () => {
    it('deve criar exceção com identificador do usuário', () => {
      // Arrange & Act
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        "Usuário 'usuario@example.com' não encontrado",
      );
      expect(exception.name).toBe('UsuarioNaoEncontradoException');
    });

    it('deve aceitar ID UUID como identificador', () => {
      // Arrange
      const usuarioId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const exception = new UsuarioNaoEncontradoException(usuarioId);

      // Assert
      expect(exception.message).toContain(usuarioId);
    });
  });

  describe('EmailJaExisteException', () => {
    it('deve criar exceção com email duplicado', () => {
      // Arrange & Act
      const exception = new EmailJaExisteException('duplicate@example.com');

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        "Email 'duplicate@example.com' já está cadastrado",
      );
      expect(exception.name).toBe('EmailJaExisteException');
    });

    it('deve incluir email na mensagem de erro', () => {
      // Arrange
      const email = 'test@test.com';

      // Act
      const exception = new EmailJaExisteException(email);

      // Assert
      expect(exception.message).toContain(email);
    });
  });

  describe('CredenciaisInvalidasException', () => {
    it('deve criar exceção sem parâmetros', () => {
      // Arrange & Act
      const exception = new CredenciaisInvalidasException();

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe('Email ou senha inválidos');
      expect(exception.name).toBe('CredenciaisInvalidasException');
    });

    it('não deve expor detalhes de qual campo está errado', () => {
      // Arrange & Act
      const exception = new CredenciaisInvalidasException();

      // Assert
      expect(exception.message).not.toContain('email inválido');
      expect(exception.message).not.toContain('senha inválida');
      expect(exception.message).toBe('Email ou senha inválidos');
    });
  });

  describe('TreinoNaoEncontradoException', () => {
    it('deve criar exceção com ID do treino', () => {
      // Arrange
      const treinoId = '987e6543-e21c-34d5-a789-123456789abc';

      // Act
      const exception = new TreinoNaoEncontradoException(treinoId);

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        `Treino com ID '${treinoId}' não encontrado`,
      );
      expect(exception.name).toBe('TreinoNaoEncontradoException');
    });

    it('deve incluir ID na mensagem de erro', () => {
      // Arrange
      const id = 'abc-123';

      // Act
      const exception = new TreinoNaoEncontradoException(id);

      // Assert
      expect(exception.message).toContain(id);
    });
  });

  describe('PermissaoNegadaException', () => {
    it('deve criar exceção com ação negada', () => {
      // Arrange & Act
      const exception = new PermissaoNegadaException('deletar este treino');

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        'Você não tem permissão para deletar este treino',
      );
      expect(exception.name).toBe('PermissaoNegadaException');
    });

    it('deve aceitar diferentes ações', () => {
      // Arrange
      const acoes = ['visualizar', 'editar', 'excluir'];

      // Act & Assert
      acoes.forEach((acao) => {
        const exception = new PermissaoNegadaException(acao);
        expect(exception.message).toContain(acao);
      });
    });
  });

  describe('DadosInvalidosException', () => {
    it('deve criar exceção com campo e motivo', () => {
      // Arrange & Act
      const exception = new DadosInvalidosException(
        'carga',
        'deve ser positiva',
      );

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        "Campo 'carga' inválido: deve ser positiva",
      );
      expect(exception.name).toBe('DadosInvalidosException');
    });

    it('deve incluir campo e motivo na mensagem', () => {
      // Arrange
      const campo = 'repeticoes';
      const motivo = 'deve ser maior que zero';

      // Act
      const exception = new DadosInvalidosException(campo, motivo);

      // Assert
      expect(exception.message).toContain(campo);
      expect(exception.message).toContain(motivo);
    });
  });

  describe('AnaliseIndisponivelException', () => {
    it('deve criar exceção com motivo', () => {
      // Arrange & Act
      const exception = new AnaliseIndisponivelException('dados insuficientes');

      // Assert
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        'Análise indisponível: dados insuficientes',
      );
      expect(exception.name).toBe('AnaliseIndisponivelException');
    });

    it('deve aceitar diferentes motivos', () => {
      // Arrange
      const motivos = [
        'nenhum treino encontrado',
        'período inválido',
        'exercício não cadastrado',
      ];

      // Act & Assert
      motivos.forEach((motivo) => {
        const exception = new AnaliseIndisponivelException(motivo);
        expect(exception.message).toContain(motivo);
      });
    });
  });

  describe('Herança e Hierarquia', () => {
    it('todas as exceções devem herdar de DomainException', () => {
      // Arrange & Act
      const exceptions = [
        new UsuarioNaoEncontradoException('user'),
        new EmailJaExisteException('email@test.com'),
        new CredenciaisInvalidasException(),
        new TreinoNaoEncontradoException('id'),
        new PermissaoNegadaException('acao'),
        new DadosInvalidosException('campo', 'motivo'),
        new AnaliseIndisponivelException('motivo'),
      ];

      // Assert
      exceptions.forEach((exception) => {
        expect(exception).toBeInstanceOf(DomainException);
        expect(exception).toBeInstanceOf(Error);
      });
    });

    it('cada exceção deve ter nome único', () => {
      // Arrange
      const exceptions = [
        new UsuarioNaoEncontradoException('user'),
        new EmailJaExisteException('email@test.com'),
        new CredenciaisInvalidasException(),
        new TreinoNaoEncontradoException('id'),
        new PermissaoNegadaException('acao'),
        new DadosInvalidosException('campo', 'motivo'),
        new AnaliseIndisponivelException('motivo'),
      ];

      // Act
      const names = exceptions.map((e) => e.name);
      const uniqueNames = new Set(names);

      // Assert
      expect(uniqueNames.size).toBe(exceptions.length);
    });
  });

  describe('Lançamento de Exceções', () => {
    it('deve ser possível capturar DomainException', () => {
      // Arrange
      const throwException = () => {
        throw new UsuarioNaoEncontradoException('test');
      };

      // Act & Assert
      expect(throwException).toThrow(DomainException);
      expect(throwException).toThrow(UsuarioNaoEncontradoException);
    });

    it('deve preservar stack trace ao lançar', () => {
      // Arrange
      let exception: DomainException | null = null;

      // Act
      try {
        throw new EmailJaExisteException('test@test.com');
      } catch (error) {
        exception = error as DomainException;
      }

      // Assert
      expect(exception).not.toBeNull();
      expect(exception?.stack).toBeDefined();
      expect(exception?.stack).toContain('EmailJaExisteException');
    });
  });

  describe('Mensagens Consistentes', () => {
    it('todas as mensagens devem ser em português', () => {
      // Arrange & Act
      const exceptions = [
        new UsuarioNaoEncontradoException('user'),
        new EmailJaExisteException('email@test.com'),
        new CredenciaisInvalidasException(),
        new TreinoNaoEncontradoException('id'),
        new PermissaoNegadaException('acao'),
        new DadosInvalidosException('campo', 'motivo'),
        new AnaliseIndisponivelException('motivo'),
      ];

      // Assert
      exceptions.forEach((exception) => {
        expect(exception.message).toBeTruthy();
        expect(exception.message.length).toBeGreaterThan(0);
      });
    });
  });
});
