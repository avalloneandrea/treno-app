import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('AuthService', () => {

  let service: AuthService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useClass: StoreMock },
        { provide: HttpService, useClass: HttpMock },
      ],
    }).compile();
    service = fixture.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle authorizations', () => {
    service.handleAuthorizations('code')
      .subscribe(result => expect(result).toEqual({ url: 'https://slack.com/app_redirect?app=4PP1D' }));
  });

});
