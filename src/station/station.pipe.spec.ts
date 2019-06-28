import { Test, TestingModule } from '@nestjs/testing';
import { StationPipe } from './station.pipe';

describe('StationPipe', () => {

  let stationPipe: StationPipe;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [StationPipe]
    }).compile();
    stationPipe = testingModule.get<StationPipe>(StationPipe);
  });

  it('should be defined', () => {
    expect(stationPipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(stationPipe.transform('2424 - SAPRI|2424-S11721')).toBe('S11721');
  });

  it('should not transform an invalid value', () => {
    expect(stationPipe.transform('')).toBeNull();
  });

});
