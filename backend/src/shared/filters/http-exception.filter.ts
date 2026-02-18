import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DomainException,
  UsuarioNaoEncontradoException,
  EmailJaExisteException,
  CredenciaisInvalidasException,
  TreinoNaoEncontradoException,
  PermissaoNegadaException,
  DadosInvalidosException,
} from '../../domain/exceptions/domain.exception';

/**
 * Filtro global de exceções HTTP
 * Formata erros de forma consistente e trata exceções de domínio
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;

    // Mapear exceções de domínio para status HTTP
    if (exception instanceof UsuarioNaoEncontradoException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof TreinoNaoEncontradoException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof EmailJaExisteException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof CredenciaisInvalidasException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof PermissaoNegadaException) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    } else if (exception instanceof DadosInvalidosException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = this.extractMessage(exceptionResponse);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
    }

    const statusCode: number = status;

    const errorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: exception instanceof Error ? exception.name : 'UnknownError',
    };

    // Log de erro com diferentes níveis
    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${message}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    } else if (statusCode >= 400) {
      this.logger.warn(`${request.method} ${request.url} - ${message}`);
    }

    response.status(statusCode).send(errorResponse);
  }

  private extractMessage(exceptionResponse: unknown): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        const message = (exceptionResponse as { message?: unknown }).message;
        if (typeof message === 'string') {
          return message;
        }

        if (Array.isArray(message)) {
          const firstMessage = message.find((item) => typeof item === 'string');
          if (typeof firstMessage === 'string') {
            return firstMessage;
          }
        }
      }
    }

    return 'Erro na requisição';
  }
}
