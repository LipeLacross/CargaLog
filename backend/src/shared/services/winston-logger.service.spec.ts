import { WinstonLoggerService } from './winston-logger.service';

describe('WinstonLoggerService', () => {
  let service: WinstonLoggerService;

  beforeEach(() => {
    service = new WinstonLoggerService();
  });

  describe('Log Info', () => {
    it('deve fazer log de mensagem com nível info', () => {
      // Arrange
      const mensagem = 'Usuário registrado com sucesso';
      const context = 'AuthService';

      // Act
      expect(() => {
        service.log(mensagem, context);
      }).not.toThrow();
    });

    it('deve fazer log sem erro', () => {
      // Arrange
      const mensagem = 'Operação concluída';

      // Act & Assert
      expect(() => {
        service.log(mensagem);
      }).not.toThrow();
    });
  });

  describe('Log Warn', () => {
    it('deve fazer log de aviso', () => {
      // Arrange
      const mensagem = 'Múltiplas tentativas de login falhas';
      const context = 'AuthService';

      // Act & Assert
      expect(() => {
        service.warn(mensagem, context);
      }).not.toThrow();
    });

    it('deve fazer log de aviso sem contexto', () => {
      // Arrange
      const mensagem = 'Aviso genérico';

      // Act & Assert
      expect(() => {
        service.warn(mensagem);
      }).not.toThrow();
    });
  });

  describe('Log Error', () => {
    it('deve fazer log de erro', () => {
      // Arrange
      const mensagem = 'Erro ao buscar usuário no banco';
      const contexto = 'UsuarioRepository';

      // Act & Assert
      expect(() => {
        service.error(mensagem, contexto);
      }).not.toThrow();
    });

    it('deve fazer log de erro com stack trace', () => {
      // Arrange
      const mensagem = 'Erro crítico';
      const stack = 'Error: Something went wrong\n  at Function.method';

      // Act & Assert
      expect(() => {
        service.error(mensagem, stack);
      }).not.toThrow();
    });

    it('deve fazer log de erro sem stack trace', () => {
      // Arrange
      const mensagem = 'Erro desconhecido';

      // Act & Assert
      expect(() => {
        service.error(mensagem);
      }).not.toThrow();
    });
  });

  describe('Log Debug', () => {
    it('deve fazer log de debug', () => {
      // Arrange
      const mensagem = 'Variável usuarioId = abc123';
      const contexto = 'DebugService';

      // Act & Assert
      expect(() => {
        service.debug(mensagem, contexto);
      }).not.toThrow();
    });
  });

  describe('Log Verbose', () => {
    it('deve fazer log verbose', () => {
      // Arrange
      const mensagem = 'Detalhes de requisição HTTP';
      const contexto = 'HttpModule';

      // Act & Assert
      expect(() => {
        service.verbose(mensagem, contexto);
      }).not.toThrow();
    });
  });

  describe('Diferentes Contextos', () => {
    it('deve diferenciar logs por contexto', () => {
      // Arrange
      const mensagem = 'Operação realizada';

      // Act & Assert
      expect(() => {
        service.log(mensagem, 'ContextoA');
        service.log(mensagem, 'ContextoB');
        service.log(mensagem, 'ContextoC');
      }).not.toThrow();
    });

    it('deve fazer log com contexto vazio', () => {
      // Arrange
      const mensagem = 'Sem contexto específico';

      // Act & Assert
      expect(() => {
        service.log(mensagem, '');
      }).not.toThrow();
    });
  });

  describe('Mensagens com Caracteres Especiais', () => {
    it('deve fazer log de mensagens com caracteres especiais', () => {
      // Arrange
      const mensagem = 'Erro: não foi possível validar "email@example.com"';

      // Act & Assert
      expect(() => {
        service.log(mensagem);
      }).not.toThrow();
    });

    it('deve fazer log com quebras de linha', () => {
      // Arrange
      const mensagem = 'Erro em múltiplas linhas:\nLinha 1\nLinha 2';

      // Act & Assert
      expect(() => {
        service.error(mensagem);
      }).not.toThrow();
    });
  });

  describe('Implementação de LoggerService', () => {
    it('deve implementar métodos de LoggerService do NestJS', () => {
      // Assert
      expect(service).toHaveProperty('log');
      expect(service).toHaveProperty('error');
      expect(service).toHaveProperty('warn');
      expect(service).toHaveProperty('debug');
      expect(service).toHaveProperty('verbose');
    });

    it('deve ter método log como função', () => {
      // Assert
      expect(typeof service.log).toBe('function');
    });

    it('deve ter método error como função', () => {
      // Assert
      expect(typeof service.error).toBe('function');
    });

    it('deve ter método warn como função', () => {
      // Assert
      expect(typeof service.warn).toBe('function');
    });
  });
});
