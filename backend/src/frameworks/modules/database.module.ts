import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Treino } from '../../domain/entities/treino.entity';
import { Analise } from '../../domain/entities/analise.entity';

/**
 * Módulo de Database
 * Configuração global do TypeORM com factory assíncrona
 */
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.get<string>('DATABASE_URL'),
        entities: [Usuario, Treino, Analise],
        migrations: ['dist/frameworks/database/migrations/*.js'],
        migrationsTableName: 'migrations',
        migrationsRun: false,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
