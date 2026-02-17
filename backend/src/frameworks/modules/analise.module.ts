import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treino } from '../../domain/entities/treino.entity';
import { AnaliseController } from '../../interface-adapters/controllers/analise.controller';
import { GerarRelatorioProgressoUseCase } from '../../application/use-cases/analise/gerar-relatorio-progresso.use-case';
import { ObterEstatisticasUseCase } from '../../application/use-cases/analise/obter-estatisticas.use-case';
import { TypeOrmAnaliseRepository } from '../../interface-adapters/repositories/typeorm-analise.repository';
import { AuthModule } from './auth.module';

/**
 * Módulo de Análise
 * Funcionalidades de estatísticas e relatórios
 */
@Module({
  imports: [TypeOrmModule.forFeature([Treino]), AuthModule],
  controllers: [AnaliseController],
  providers: [
    GerarRelatorioProgressoUseCase,
    ObterEstatisticasUseCase,
    {
      provide: 'IAnaliseRepository',
      useClass: TypeOrmAnaliseRepository,
    },
  ],
})
export class AnaliseModule {}
