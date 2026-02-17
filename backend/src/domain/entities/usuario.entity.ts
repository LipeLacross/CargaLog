import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Treino } from './treino.entity';

/**
 * Entidade de domínio Usuario
 * Representa um usuário do sistema com autenticação
 */
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string; // Hash bcrypt

  @OneToMany(() => Treino, (treino) => treino.usuario)
  treinos: Treino[];

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  /**
   * Valida se a senha fornecida corresponde ao hash armazenado
   * @param senhaPlain - Senha em texto plano
   * @param senhaHash - Hash armazenado
   * @returns boolean
   */
  static async validarSenha(
    senhaPlain: string,
    senhaHash: string,
  ): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(senhaPlain, senhaHash);
  }

  /**
   * Gera hash da senha para armazenamento seguro
   * @param senha - Senha em texto plano
   * @returns Hash bcrypt da senha
   */
  static async hashSenha(senha: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hash(senha, saltRounds);
  }
}
