import { Test, TestingModule } from '@nestjs/testing';
import { StationPipe } from './station.pipe';

describe('StationPipe', () => {

  let stationPipe: StationPipe;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [StationPipe]
    }).compile();
    stationPipe = fixture.get(StationPipe);
  });

  it('should be defined', () => {
    expect(stationPipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(stationPipe.transform('80 - VERONA PORTA NUOVA|80-S02430')).toBe('S02430');
  });

  it('should not transform an invalid value', () => {
    expect(stationPipe.transform('')).toBeNull();
  });

});
