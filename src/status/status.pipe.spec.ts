import { Test, TestingModule } from '@nestjs/testing';

import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {

  let pipe: StatusPipe;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [ StatusPipe ]
    }).compile();
    pipe = fixture.get(StatusPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(pipe.transform('72415')).toBe('72415');
    expect(pipe.transform('@treno 72415')).toBe('72415');
    expect(pipe.transform('Remind: @treno 72415.')).toBe('72415');
  });

  it('should not transform an invalid value', () => {
    expect(pipe.transform('')).toBeNull();
    expect(pipe.transform('train')).toBeNull();
    expect(pipe.transform('@treno train')).toBeNull();
    expect(pipe.transform('Remind: @treno train.')).toBeNull();
  });

});
