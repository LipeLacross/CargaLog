import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './frameworks/modules/database.module';
import { AuthModule } from './frameworks/modules/auth.module';
import { TreinoModule } from './frameworks/modules/treino.module';
import { AnaliseModule } from './frameworks/modules/analise.module';

@Module({
  imports: [
    // Configuração global de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Módulos da aplicação
    DatabaseModule,
    AuthModule,
    TreinoModule,
    AnaliseModule,
  ],
})
export class AppModule {}
