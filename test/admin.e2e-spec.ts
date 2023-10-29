import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../src/entities/admin.entity';
import { AdminModule } from '../src/routes/admin/admin.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const mockAdminRepository = {

  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    }).overrideProvider(getRepositoryToken(Admin)).useValue(mockAdminRepository).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/admin (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin')
      .expect(200)
      
  });
});
