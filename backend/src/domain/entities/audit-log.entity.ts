import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('logs_auditoria')
@Index(['usuarioId'])
@Index(['entidade', 'entidadeId'])
@Index(['criadoEm'])
@Index(['acao'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuarioId: string | null;

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null;

  @Column({ type: 'varchar', length: 100 })
  acao: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  entidade: string | null;

  @Column({ name: 'entidade_id', type: 'uuid', nullable: true })
  entidadeId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  dadosAnteriores: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  dadosNovos: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
