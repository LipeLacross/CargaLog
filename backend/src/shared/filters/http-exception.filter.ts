import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
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
    const response = ctx.getResponse();
    const request = ctx.getRequest();

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
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Erro na requisição';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error:
        exception instanceof Error ? exception.name : 'UnknownError',
    };

    // Log de erro com diferentes níveis
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${message}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${message}`,
      );
    }

    response.status(status).send(errorResponse);
  }
}
