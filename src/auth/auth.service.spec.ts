import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from "./auth.service";
import { HttpServiceMock } from '../../test/http.service.mock';

describe('AuthService', () => {

  let service: AuthService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useClass: HttpServiceMock }
      ]
    }).compile();
    service = fixture.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle authorizations', () => {
    service.authorize('code')
      .subscribe(result => expect(result).toEqual({ url: 'www.redirect.url' }));
  });

});
