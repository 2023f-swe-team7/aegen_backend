import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/auth/dtos/create-user.dto';

const testUser: CreateUserDto = {
  id: 'test212121',
  name: 'jcyy',
  studentId: '2020',
  password: '1234',
  email: 'jcyy@gmail.com',
  major: 'software',
  subject: ['운영체제'],
};
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.setGlobalPrefix('v1');

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.enableShutdownHooks();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/')
      .expect(200)
      .expect('Hello World!');
  });
  describe('auth', () => {
    it('/ (POST) login', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          id: 'testId',
          password: '1234',
        })
        .expect(201);
    });
    it('/ (POST) createUser', () => {
      return request(app.getHttpServer())
        .post('/v1/auth')
        .send(testUser)
        .expect(201);
    });
  });
  describe('mail', () => {
    it('/ (GET) generateMail', () => {
      return request(app.getHttpServer())
        .get('/v1/mail')
        .query({ subject: '소프트웨어공학개론', type: '수업' })
        .expect(401);
    });
    it('/ (POST) sendMail', () => {
      return request(app.getHttpServer()).post('/v1/mail/send').expect(500);
    });
  });
});