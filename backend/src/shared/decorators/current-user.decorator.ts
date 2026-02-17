import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para extrair usuário autenticado do request
 * Uso: @CurrentUser() usuario
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
