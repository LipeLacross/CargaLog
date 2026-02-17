import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para autenticação de usuário (login)
 */
export class LoginDto {
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  senha: string;
}
