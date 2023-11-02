import { Test, TestingModule } from '@nestjs/testing';
import { IothubController } from './iothub.controller';

describe('IothubController', () => {
  let controller: IothubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IothubController],
    }).compile();

    controller = module.get<IothubController>(IothubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
