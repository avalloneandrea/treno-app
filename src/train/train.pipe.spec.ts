import { Test, TestingModule } from '@nestjs/testing';
import { TrainPipe } from './train.pipe';

describe('TrainPipe', () => {

  let trainPipe: TrainPipe;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [TrainPipe]
    }).compile();
    trainPipe = testingModule.get<TrainPipe>(TrainPipe);
  });

  it('should be defined', () => {
    expect(trainPipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(trainPipe.transform('2424')).toBe('2424');
    expect(trainPipe.transform('@treno 2424')).toBe('2424');
    expect(trainPipe.transform('Remind: @treno 2424.')).toBe('2424');
  });

  it('should not transform an invalid value', () => {
    expect(trainPipe.transform('')).toBeNull();
  });

});
