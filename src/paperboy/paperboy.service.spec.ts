import { Test, TestingModule } from '@nestjs/testing';
import { PaperboyService } from './paperboy.service';

describe('PaperboyService', () => {
  let service: PaperboyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaperboyService],
    }).compile();

    service = module.get<PaperboyService>(PaperboyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
