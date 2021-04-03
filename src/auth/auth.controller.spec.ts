import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('AuthController', () => {

  let controller: AuthController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController, AuthService,
        { provide: CACHE_MANAGER, useClass: StoreMock },
        { provide: HttpService, useClass: HttpMock },
      ],
    }).compile();
    controller = fixture.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle authorizations', () => {
    controller.handleAuthorizations('code')
      .subscribe(result => expect(result).toEqual({ url: 'https://slack.com/app_redirect?app=4PP1D' }));
  });

});
