import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { TokenPayloadDto } from '../../application/dto/auth/token-payload.dto';
import { Usuario } from '../../domain/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'default_secret_key',
      algorithms: ['HS256'],
    });
  }

  async validate(payload: TokenPayloadDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: payload.userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario nao encontrado');
    }

    return usuario;
  }
}
