import { Test, TestingModule } from '@nestjs/testing';
import { StationPipe } from './station.pipe';

describe('StationPipe', () => {

  let pipe: StationPipe;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [StationPipe]
    }).compile();
    pipe = fixture.get(StationPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(pipe.transform('72415 - STATION|72415-5747105')).toBe('5747105');
  });

  it('should not transform an invalid value', () => {
    expect(pipe.transform('')).toBeNull();
    expect(pipe.transform('+?@|/')).toBeNull();
  });

});
