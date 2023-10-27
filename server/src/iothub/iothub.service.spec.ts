import { Test, TestingModule } from '@nestjs/testing';
import { IothubService } from './iothub.service';

describe('IothubService', () => {
  let service: IothubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IothubService],
    }).compile();

    service = module.get<IothubService>(IothubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
