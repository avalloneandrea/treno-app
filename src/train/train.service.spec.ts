import { Test, TestingModule } from '@nestjs/testing';
import { TrainService } from './train.service';

describe('TrainService', () => {
  let service: TrainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainService]
    }).compile();

    service = module.get<TrainService>(TrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
