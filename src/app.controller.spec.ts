import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { faker } from '@faker-js/faker';

describe('AppController', () => {
  let appController: AppController;
  const mockAppService = {
    adminRegistration: jest.fn(dto => ({
      id: faker.string.uuid(),
      password: faker.internet.password(),
      ...dto
    }))
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).overrideProvider(AppService).useValue(mockAppService).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should create an admin', () => {
      const dto = {username: 'ali fathi', password: '123456', role: 'admin'}

      expect(appController.adminAdder(dto)).toEqual({
        id: expect.any(String),
        username: dto.username,
        password: expect.any(String),
        role: dto.role
      });

      expect(mockAppService.adminRegistration).toHaveBeenCalledWith(dto)
    });
  });
});
