import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treino } from '../../domain/entities/treino.entity';
import { TreinoController } from '../../interface-adapters/controllers/treino.controller';
import { RegistrarTreinoUseCase } from '../../application/use-cases/treino/registrar-treino.use-case';
import { ListarTreinosUseCase } from '../../application/use-cases/treino/listar-treinos.use-case';
import { AtualizarTreinoUseCase } from '../../application/use-cases/treino/atualizar-treino.use-case';
import { DeletarTreinoUseCase } from '../../application/use-cases/treino/deletar-treino.use-case';
import { TypeOrmTreinoRepository } from '../../interface-adapters/repositories/typeorm-treino.repository';
import { AuthModule } from './auth.module';

/**
 * Módulo de Treino
 * Funcionalidades CRUD de treinos
 */
@Module({
  imports: [TypeOrmModule.forFeature([Treino]), AuthModule],
  controllers: [TreinoController],
  providers: [
    RegistrarTreinoUseCase,
    ListarTreinosUseCase,
    AtualizarTreinoUseCase,
    DeletarTreinoUseCase,
    {
      provide: 'ITreinoRepository',
      useClass: TypeOrmTreinoRepository,
    },
  ],
  exports: ['ITreinoRepository'],
})
export class TreinoModule {}
