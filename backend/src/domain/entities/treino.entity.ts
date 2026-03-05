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

/**
 * Entidade de domínio Treino
 * Representa um registro de treino com exercício, carga e repetições
 */
@Entity('treinos')
@Index(['usuarioId', 'exercicioNome'])
@Index(['usuarioId', 'data'])
export class Treino {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.treinos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'exercicio_nome', type: 'varchar', length: 255 })
  exercicioNome: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  carga: number;

  @Column({ type: 'int' })
  repeticoes: number;

  @Column({ type: 'int', nullable: true, default: 1 })
  series: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'date' })
  data: Date;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  /**
   * Valida se a carga é positiva
   * @param carga - Valor da carga
   * @returns boolean
   */
  static validarCarga(carga: number): boolean {
    return carga > 0;
  }

  /**
   * Valida se as repetições estão no range válido
   * @param repeticoes - Número de repetições
   * @returns boolean
   */
  static validarRepeticoes(repeticoes: number): boolean {
    return repeticoes > 0 && repeticoes <= 1000;
  }

  /**
   * Valida se as séries estão no range válido
   * @param series - Número de séries
   * @returns boolean
   */
  static validarSeries(series: number): boolean {
    return series > 0 && series <= 100;
  }

  /**
   * Calcula o volume total do treino (carga x repetições x séries)
   * @returns Volume total
   */
  calcularVolume(): number {
    return this.carga * this.repeticoes * (this.series || 1);
  }
}
