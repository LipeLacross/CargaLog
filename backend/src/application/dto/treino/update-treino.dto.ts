import { PartialType } from '@nestjs/mapped-types';
import { CreateTreinoDto } from './create-treino.dto';

/**
 * DTO para atualização de treino
 * Todos os campos são opcionais
 */
export class UpdateTreinoDto extends PartialType(CreateTreinoDto) {}
