import { Test, TestingModule } from '@nestjs/testing';
import { MicController } from './mic.controller';

describe('MicController', () => {
  let controller: MicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicController],
    }).compile();

    controller = module.get<MicController>(MicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
