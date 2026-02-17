import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrarTreinoUseCase } from '../../application/use-cases/treino/registrar-treino.use-case';
import { ListarTreinosUseCase } from '../../application/use-cases/treino/listar-treinos.use-case';
import { AtualizarTreinoUseCase } from '../../application/use-cases/treino/atualizar-treino.use-case';
import { DeletarTreinoUseCase } from '../../application/use-cases/treino/deletar-treino.use-case';
import { CreateTreinoDto } from '../../application/dto/treino/create-treino.dto';
import { UpdateTreinoDto } from '../../application/dto/treino/update-treino.dto';
import { JwtAuthGuard } from '../../frameworks/auth/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

/**
 * Controller de treinos
 * Endpoints CRUD de treinos
 */
@Controller('treinos')
@UseGuards(JwtAuthGuard)
export class TreinoController {
  constructor(
    private readonly registrarTreinoUseCase: RegistrarTreinoUseCase,
    private readonly listarTreinosUseCase: ListarTreinosUseCase,
    private readonly atualizarTreinoUseCase: AtualizarTreinoUseCase,
    private readonly deletarTreinoUseCase: DeletarTreinoUseCase,
  ) {}

  /**
   * POST /treinos
   * Cria um novo treino
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@CurrentUser() usuario, @Body() dto: CreateTreinoDto) {
    return this.registrarTreinoUseCase.execute(usuario.id, dto);
  }

  /**
   * GET /treinos
   * Lista treinos do usuário com filtros opcionais
   */
  @Get()
  async listar(
    @CurrentUser() usuario,
    @Query('exercicio') exercicio?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const filtros: any = {};

    if (exercicio) filtros.exercicio = exercicio;
    if (dataInicio) filtros.dataInicio = new Date(dataInicio);
    if (dataFim) filtros.dataFim = new Date(dataFim);

    return this.listarTreinosUseCase.execute(
      usuario.id,
      Object.keys(filtros).length > 0 ? filtros : undefined,
    );
  }

  /**
   * PATCH /treinos/:id
   * Atualiza um treino
   */
  @Patch(':id')
  async atualizar(
    @Param('id') id: string,
    @CurrentUser() usuario,
    @Body() dto: UpdateTreinoDto,
  ) {
    return this.atualizarTreinoUseCase.execute(id, usuario.id, dto);
  }

  /**
   * DELETE /treinos/:id
   * Deleta um treino
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletar(@Param('id') id: string, @CurrentUser() usuario) {
    await this.deletarTreinoUseCase.execute(id, usuario.id);
  }
}
