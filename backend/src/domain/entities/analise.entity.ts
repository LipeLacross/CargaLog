import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

/**
 * Entidade de domínio Analise
 * Representa uma análise de progresso para um exercício específico
 * (Cache de métricas calculadas - opcional)
 */
@Entity('analises')
export class Analise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'exercicio_nome', type: 'varchar', length: 255 })
  exercicioNome: string;

  @Column({ name: 'periodo_inicio', type: 'date' })
  periodoInicio: Date;

  @Column({ name: 'periodo_fim', type: 'date' })
  periodoFim: Date;

  @Column({ name: 'carga_maxima', type: 'decimal', precision: 10, scale: 2 })
  cargaMaxima: number;

  @Column({ name: 'carga_media', type: 'decimal', precision: 10, scale: 2 })
  cargaMedia: number;

  @Column({ name: 'total_treinos', type: 'int' })
  totalTreinos: number;

  @Column({
    name: 'progresso',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  progresso: number; // Percentual de progresso

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  /**
   * Calcula o percentual de progresso entre carga inicial e final
   * @param cargaInicial - Carga no início do período
   * @param cargaFinal - Carga no fim do período
   * @returns Percentual de progresso
   */
  static calcularProgresso(cargaInicial: number, cargaFinal: number): number {
    if (cargaInicial === 0) return 0;
    return ((cargaFinal - cargaInicial) / cargaInicial) * 100;
  }

  /**
   * Calcula a média de cargas
   * @param cargas - Array de valores de carga
   * @returns Média das cargas
   */
  static calcularMedia(cargas: number[]): number {
    if (cargas.length === 0) return 0;
    const soma = cargas.reduce((acc, carga) => acc + carga, 0);
    return soma / cargas.length;
  }
}
