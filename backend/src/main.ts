import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  // Cria aplicação com Fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Lança erro se houver propriedades extras
      transform: true, // Transforma payloads em DTOs
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Exception filter global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor de logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Prefixo global para rotas
  app.setGlobalPrefix('api/v1');

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 CargaLog API rodando em: ${await app.getUrl()}`);
  console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);
}

void bootstrap();
