import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Usuario } from '../../domain/entities/usuario.entity';

interface RequestWithUser extends Request {
  user?: Usuario;
}

/**
 * Decorator para extrair usuário autenticado do request
 * Uso: @CurrentUser() usuario
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
