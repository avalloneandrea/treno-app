import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('treno-app (e2e)', () => {

  let app;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = fixture.createNestApplication();
    await app.init();
  });

  it('should pass', () => {
    expect(true).toBeTruthy();
  });

});
