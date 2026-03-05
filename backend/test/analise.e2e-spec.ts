import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const describeE2e = hasDatabase ? describe : describe.skip;

describeE2e('Analise E2E Flow', () => {
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
    const uniqueEmail = `analise_${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/registrar')
      .send({
        nome: 'Usuario Analise',
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

  const createTreino = async (carga: number, data: string) => {
    await request(app.getHttpServer())
      .post('/treinos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        exercicioNome: 'Supino',
        carga,
        repeticoes: 10,
        series: 3,
        data,
      })
      .expect(201);
  };

  beforeAll(async () => {
    app = await buildApp();
    token = await registerAndLogin();

    await createTreino(80, new Date('2025-01-01').toISOString());
    await createTreino(90, new Date('2025-01-10').toISOString());
    await createTreino(100, new Date('2025-01-20').toISOString());
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve obter estatisticas', async () => {
    const response = await request(app.getHttpServer())
      .get('/analises/estatisticas')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.totalTreinos).toBeGreaterThan(0);
    expect(Array.isArray(response.body.exercicios)).toBe(true);
    expect(response.body.recordesPorExercicio).toBeDefined();
  });

  it('deve obter progresso', async () => {
    const response = await request(app.getHttpServer())
      .get('/analises/progresso/Supino')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.exercicio).toBe('Supino');
    expect(response.body.cargaMaxima).toBeGreaterThan(0);
    expect(Array.isArray(response.body.pontos)).toBe(true);
  });
});
