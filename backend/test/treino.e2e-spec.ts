import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const describeE2e = hasDatabase ? describe : describe.skip;

describeE2e('Treino E2E Flow', () => {
  let app: INestApplication<App>;
  let token: string;

  const buildApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await nestApp.init();
    return nestApp;
  };

  const registerAndLogin = async () => {
    const uniqueEmail = `treino_${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/registrar')
      .send({
        nome: 'Usuario Treino',
        email: uniqueEmail,
        senha: 'Senha@123',
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, senha: 'Senha@123' })
      .expect(200);

    return loginResponse.body.token as string;
  };

  beforeAll(async () => {
    app = await buildApp();
    token = await registerAndLogin();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar, listar, atualizar e deletar treino', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/treinos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        exercicioNome: 'Supino',
        carga: 100,
        repeticoes: 10,
        series: 3,
        observacoes: 'ok',
        data: new Date().toISOString(),
      })
      .expect(201);

    const treinoId = createResponse.body.id as string;
    expect(treinoId).toBeDefined();

    const listResponse = await request(app.getHttpServer())
      .get('/treinos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);

    await request(app.getHttpServer())
      .patch(`/treinos/${treinoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ carga: 110 })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/treinos/${treinoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
