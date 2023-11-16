import { Test, TestingModule } from '@nestjs/testing';
import { MicService } from './mic.service';

describe('MicService', () => {
  let service: MicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicService],
    }).compile();

    service = module.get<MicService>(MicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
