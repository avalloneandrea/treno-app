import { Test } from '@nestjs/testing';

import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {

  let pipe: StatusPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ StatusPipe ],
    }).compile();
    pipe = module.get(StatusPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform a valid value', () => {
    expect(pipe.transform('7241')).toBe('7241');
    expect(pipe.transform('@treno 7241')).toBe('7241');
    expect(pipe.transform('Remind: @treno 7241.')).toBe('7241');
  });

  it('should not transform an invalid value', () => {
    expect(pipe.transform('')).toBeNull();
    expect(pipe.transform('train')).toBeNull();
    expect(pipe.transform('@treno train')).toBeNull();
    expect(pipe.transform('Remind: @treno train.')).toBeNull();
  });

});
