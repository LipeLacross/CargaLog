import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Treino } from '../../domain/entities/treino.entity';
import { Analise } from '../../domain/entities/analise.entity';

/**
 * Configuração do TypeORM
 * Conecta ao PostgreSQL e define entidades
 */
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Usuario, Treino, Analise],
  migrations: ['dist/frameworks/database/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development', // Apenas em dev, usar migrations em prod
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};
