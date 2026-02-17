import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../database/typeorm.config';

/**
 * Módulo de Database
 * Configuração global do TypeORM
 */
@Global()
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
