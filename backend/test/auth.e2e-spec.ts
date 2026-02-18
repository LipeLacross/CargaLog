import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const describeE2e = hasDatabase ? describe : describe.skip;

describeE2e('Auth E2E Flow', () => {
  let app: INestApplication<App>;

  const buildApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await nestApp.init();
    return nestApp;
  };

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve registrar, logar e acessar perfil', async () => {
    const uniqueEmail = `user_${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/registrar')
      .send({
        nome: 'Usuario E2E',
        email: uniqueEmail,
        senha: 'Senha@123',
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, senha: 'Senha@123' })
      .expect(200);

    const token = loginResponse.body.token as string;
    expect(token).toBeDefined();

    const profileResponse = await request(app.getHttpServer())
      .get('/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.email).toBe(uniqueEmail);
    expect(profileResponse.body).not.toHaveProperty('senha');
  });

  it('deve retornar conflito para email duplicado', async () => {
    const uniqueEmail = `dup_${Date.now()}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/registrar')
      .send({
        nome: 'Usuario E2E',
        email: uniqueEmail,
        senha: 'Senha@123',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/registrar')
      .send({
        nome: 'Usuario E2E',
        email: uniqueEmail,
        senha: 'Senha@123',
      })
      .expect(409);
  });
});

