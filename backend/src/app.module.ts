import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './frameworks/modules/database.module';
import { AuthModule } from './frameworks/modules/auth.module';
import { TreinoModule } from './frameworks/modules/treino.module';
import { AnaliseModule } from './frameworks/modules/analise.module';
import { LoggerModule } from './shared/services/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    TreinoModule,
    AnaliseModule,
  ],
})
export class AppModule {}
