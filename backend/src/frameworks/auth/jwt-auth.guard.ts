import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface GuardInfo {
  message?: string;
}

/**
 * Guard de autenticação JWT
 * Protege rotas que requerem autenticação
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  override handleRequest<TUser>(
    err: unknown,
    user: TUser | false | null,
    info?: GuardInfo | string,
  ): TUser {
    const errMessage = err instanceof Error ? err.message : undefined;
    const infoMessage = typeof info === 'string' ? info : info?.message;

    if (errMessage || infoMessage) {
      throw new UnauthorizedException(infoMessage || errMessage);
    }

    if (!user) {
      throw new UnauthorizedException('Autenticacao necessaria');
    }

    return user;
  }
}
