import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Usuario } from './src/domain/entities/usuario.entity';
import { Treino } from './src/domain/entities/treino.entity';
import { Analise } from './src/domain/entities/analise.entity';

// Carrega variáveis de ambiente
config();

/**
 * Configuração do DataSource para TypeORM CLI
 * Usado para gerar e executar migrations
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Usuario, Treino, Analise],
  migrations: ['src/frameworks/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Sempre false para evitar perda de dados
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

