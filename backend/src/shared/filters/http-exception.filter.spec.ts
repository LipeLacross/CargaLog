import { vi, describe, it, expect } from 'vitest';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  DomainException,
  UsuarioNaoEncontradoException,
  EmailJaExisteException,
  CredenciaisInvalidasException,
  TreinoNaoEncontradoException,
  PermissaoNegadaException,
  DadosInvalidosException,
} from '../../domain/exceptions/domain.exception';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    // Mock do response
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    // Mock do request
    mockRequest = {
      url: '/api/test',
      method: 'GET',
    };

    // Mock do ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: vi.fn().mockReturnValue(mockResponse),
        getRequest: vi.fn().mockReturnValue(mockRequest),
      }),
    } as any;
  });

  describe('Mapeamento de Exceções de Domínio', () => {
    it('deve mapear UsuarioNaoEncontradoException para 404', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('deve mapear TreinoNaoEncontradoException para 404', () => {
      // Arrange
      const exception = new TreinoNaoEncontradoException('treino-123');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });

    it('deve mapear EmailJaExisteException para 409 Conflict', () => {
      // Arrange
      const exception = new EmailJaExisteException('usuario@example.com');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    });

    it('deve mapear CredenciaisInvalidasException para 401 Unauthorized', () => {
      // Arrange
      const exception = new CredenciaisInvalidasException();

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    });

    it('deve mapear PermissaoNegadaException para 403 Forbidden', () => {
      // Arrange
      const exception = new PermissaoNegadaException();

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });

    it('deve mapear DadosInvalidosException para 400 Bad Request', () => {
      // Arrange
      const exception = new DadosInvalidosException('Carga deve ser positiva');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('deve mapear DomainException genérica para 400 Bad Request', () => {
      // Arrange
      const exception = new DomainException('Erro de domínio genérico');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Formato de Resposta', () => {
    it('deve retornar formato consistente de erro', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData).toHaveProperty('statusCode');
      expect(responseData).toHaveProperty('timestamp');
      expect(responseData).toHaveProperty('path');
      expect(responseData).toHaveProperty('method');
      expect(responseData).toHaveProperty('message');
      expect(responseData).toHaveProperty('error');
    });

    it('deve incluir URL da requisição no erro', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );
      mockRequest.url = '/api/usuarios/123';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.path).toBe('/api/usuarios/123');
    });

    it('deve incluir método HTTP no erro', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );
      mockRequest.method = 'POST';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.method).toBe('POST');
    });

    it('deve incluir mensagem de erro', () => {
      // Arrange
      const exception = new CredenciaisInvalidasException();

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.message).toBeDefined();
      expect(responseData.message.length).toBeGreaterThan(0);
    });

    it('deve incluir timestamp no erro', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.timestamp).toBeDefined();
      expect(new Date(responseData.timestamp)).toBeInstanceOf(Date);
    });

    it('deve incluir nome da exceção no campo error', () => {
      // Arrange
      const exception = new EmailJaExisteException('usuario@example.com');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.error).toBeDefined();
      expect(responseData.error).toMatch(/Exception/);
    });
  });

  describe('Tratamento de Erros Internos', () => {
    it('deve mapear erro desconhecido para 500 Internal Server Error', () => {
      // Arrange
      const exception = new Error('Erro inesperado');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('deve mapear exceção null para 500', () => {
      // Arrange
      const exception = null;

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('Diferentes Métodos HTTP', () => {
    it('deve funcionar com método GET', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );
      mockRequest.method = 'GET';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.method).toBe('GET');
    });

    it('deve funcionar com método POST', () => {
      // Arrange
      const exception = new EmailJaExisteException('usuario@example.com');
      mockRequest.method = 'POST';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.method).toBe('POST');
    });

    it('deve funcionar com método PATCH', () => {
      // Arrange
      const exception = new TreinoNaoEncontradoException('treino-123');
      mockRequest.method = 'PATCH';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.method).toBe('PATCH');
    });

    it('deve funcionar com método DELETE', () => {
      // Arrange
      const exception = new PermissaoNegadaException();
      mockRequest.method = 'DELETE';

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      const responseData = mockResponse.send.mock.calls[0][0];
      expect(responseData.method).toBe('DELETE');
    });
  });

  describe('Status HTTP Corretos', () => {
    it('deve retornar 404 para recurso não encontrado', () => {
      // Arrange
      const exception = new UsuarioNaoEncontradoException(
        'usuario@example.com',
      );

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 409 para conflito (email duplicado)', () => {
      // Arrange
      const exception = new EmailJaExisteException('usuario@example.com');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
    });

    it('deve retornar 401 para credenciais inválidas', () => {
      // Arrange
      const exception = new CredenciaisInvalidasException();

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('deve retornar 403 para permissão negada', () => {
      // Arrange
      const exception = new PermissaoNegadaException();

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('deve retornar 400 para dados inválidos', () => {
      // Arrange
      const exception = new DadosInvalidosException('Carga deve ser positiva');

      // Act
      filter.catch(exception, mockArgumentsHost);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});
