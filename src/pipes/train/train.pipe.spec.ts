import { Test, TestingModule } from '@nestjs/testing';
import { TrainPipe } from './train.pipe';

describe('TrainPipe', () => {

  let trainPipe: TrainPipe;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [TrainPipe]
    }).compile();
    trainPipe = fixture.get(TrainPipe);
  });

  it('should be defined', () => {
    expect(trainPipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(trainPipe.transform('80')).toBe('80');
    expect(trainPipe.transform('@treno 80')).toBe('80');
    expect(trainPipe.transform('Remind: @treno 80.')).toBe('80');
  });

  it('should not transform an invalid value', () => {
    expect(trainPipe.transform('')).toBeNull();
    expect(trainPipe.transform('eighty')).toBeNull();
    expect(trainPipe.transform('@treno eighty')).toBeNull();
    expect(trainPipe.transform('Remind: @treno eighty.')).toBeNull();
  });

});
