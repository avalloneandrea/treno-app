import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { firstValueFrom, of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {

  let service: AuthService;
  let cache: DeepMocked<Cache>;
  let http: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useValue: createMock() },
      ],
    }).useMocker(createMock).compile();
    service = module.get(AuthService);
    cache = module.get(CACHE_MANAGER);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle authorizations', async () => {
    const teamId = '73AM1D';
    const accessToken = '7OK3N';
    const appId = '4PP1D';
    const data = { team: { id: teamId }, access_token: accessToken, app_id: appId };
    http.post.mockReturnValueOnce(of({ data } as AxiosResponse));
    const res = await firstValueFrom(service.handleAuthorizations('code'));
    expect(http.post).toHaveBeenCalledWith('https://slack.com/api/oauth.v2.access', expect.anything());
    expect(cache.set).toHaveBeenCalledWith(teamId, accessToken, 0);
    expect(res.url).toContain(appId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});
