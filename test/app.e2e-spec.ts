import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IngestionModule } from '../src/ingestion/ingestion.module';
import { IngestionService } from '../src/ingestion/ingestion.service';

describe('IngestionController (e2e)', () => {
  let app: INestApplication;
  let ingestionService = {
    create: jest.fn().mockImplementation((file) => Promise.resolve('testResponse')),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IngestionModule],
    })
      .overrideProvider(IngestionService)
      .useValue(ingestionService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ingestion (POST) should return 400 if no file is provided', () => {
    return request(app.getHttpServer())
      .post('/ingestion')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'File not provided',
        error: 'Bad Request',
      });
  });

  it('/ingestion (POST) should return the response from ingestionService.create', () => {
    return request(app.getHttpServer())
      .post('/ingestion')
      .attach('file', Buffer.from('test file content'), 'testfile.txt')
      .expect(201)
      .expect('testResponse');
  });
});
