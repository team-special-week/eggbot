import { Test, TestingModule } from '@nestjs/testing';
import { PaperboyController } from './paperboy.controller';

describe('PaperboyController', () => {
  let controller: PaperboyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaperboyController],
    }).compile();

    controller = module.get<PaperboyController>(PaperboyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
