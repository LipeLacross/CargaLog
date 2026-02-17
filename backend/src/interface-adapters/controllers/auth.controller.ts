import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/registrar-usuario.use-case';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { RegistrarUsuarioDto } from '../../application/dto/auth/registrar-usuario.dto';
import { LoginDto } from '../../application/dto/auth/login.dto';
import { JwtAuthGuard } from '../../frameworks/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

/**
 * Controller de autenticação
 * Endpoints: registrar, login, perfil
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registrarUsuarioUseCase: RegistrarUsuarioUseCase,
    private readonly autenticarUsuarioUseCase: AutenticarUsuarioUseCase,
  ) {}

  /**
   * POST /auth/registrar
   * Registra um novo usuário
   */
  @Post('registrar')
  @HttpCode(HttpStatus.CREATED)
  async registrar(@Body() dto: RegistrarUsuarioDto) {
    return this.registrarUsuarioUseCase.execute(dto);
  }

  /**
   * POST /auth/login
   * Autentica usuário e retorna token JWT
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.autenticarUsuarioUseCase.execute(dto);
  }

  /**
   * GET /auth/perfil
   * Retorna dados do usuário autenticado
   */
  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  async perfil(@CurrentUser() usuario) {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}
