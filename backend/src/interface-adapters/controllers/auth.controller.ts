import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/auth/registrar-usuario.use-case';
import { AutenticarUsuarioUseCase } from '../../application/use-cases/auth/autenticar-usuario.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/reset-password.use-case';
import { AtualizarPerfilUseCase } from '../../application/use-cases/auth/atualizar-perfil.use-case';
import { RegistrarUsuarioDto } from '../../application/dto/auth/registrar-usuario.dto';
import { LoginDto } from '../../application/dto/auth/login.dto';
import { JwtAuthGuard } from '../../frameworks/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

// Interface para usuário autenticado
interface AuthenticatedUser {
  id: string;
  email: string;
  senha?: string;
}

/**
 * Controller de autenticação
 * Endpoints: registrar, login, perfil, reset-password
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registrarUsuarioUseCase: RegistrarUsuarioUseCase,
    private readonly autenticarUsuarioUseCase: AutenticarUsuarioUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly atualizarPerfilUseCase: AtualizarPerfilUseCase,
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
  perfil(@CurrentUser() usuario: AuthenticatedUser) {
    // Clona e remove senha antes de retornar o perfil
    const usuarioSemSenha = { ...usuario };
    delete usuarioSemSenha.senha;
    return usuarioSemSenha;
  }

  /**
   * PATCH /auth/perfil
   * Atualiza perfil (nome e/ou senha)
   */
  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async atualizarPerfil(
    @CurrentUser() usuario: AuthenticatedUser,
    @Body() dto: { nome?: string; senhaAtual?: string; novaSenha?: string },
  ) {
    return this.atualizarPerfilUseCase.execute(usuario.id, dto);
  }

  /**
   * POST /auth/esqueci-senha
   * Envia email com link para reset de senha
   */
  @Post('esqueci-senha')
  @HttpCode(HttpStatus.OK)
  async esqueciSenha(@Body() dto: { email: string }) {
    return this.resetPasswordUseCase.requestReset(dto);
  }

  /**
   * POST /auth/confirmar-reset-senha
   * Confirma reset de senha com novo token
   */
  @Post('confirmar-reset-senha')
  @HttpCode(HttpStatus.OK)
  async confirmarResetSenha(@Body() dto: { token: string; novaSenha: string }) {
    return this.resetPasswordUseCase.confirmReset(dto);
  }
}
