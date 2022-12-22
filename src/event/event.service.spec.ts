import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { firstValueFrom, of } from 'rxjs';

import { EventService } from './event.service';
import { StatusService } from '../status/status.service';

describe('EventService', () => {

  let cache: DeepMocked<Cache>;
  let service: EventService;
  let http: DeepMocked<HttpService>;
  let status: DeepMocked<StatusService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: CACHE_MANAGER, useValue: createMock() },
      ],
    }).useMocker(createMock).compile();
    cache = module.get(CACHE_MANAGER);
    service = module.get(EventService);
    http = module.get(HttpService);
    status = module.get(StatusService);
  });

  beforeEach(async () => {
    const data = { ok: true };
    http.post.mockReturnValue(of({ data } as AxiosResponse));
    status.getStatusByText.mockReturnValue(of(data));
    cache.get.mockReturnValue(firstValueFrom(of('70K3N')));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle url verifications events', async () => {
    const challenge = 'CH4LLEN9E';
    const res = await firstValueFrom(service.handleEvents({ type: 'url_verification', challenge }));
    expect(res).toEqual(challenge);
  });

  it('should handle bot message events', async () => {
    const bot_id = '8071D';
    const res = await firstValueFrom(service.handleEvents({ event: { bot_id } }));
    expect(res).toBeFalsy();
  });

  it('should handle unseen home opened events', async () => {
    cache.get.mockReturnValueOnce(firstValueFrom(of(null)));
    const user = 'U53R1D';
    const team_id = '734M1D';
    const res = await firstValueFrom(service.handleEvents({ event: { type: 'app_home_opened', user }, team_id }));
    expect(cache.get).toHaveBeenCalledWith(user);
    expect(cache.set).toHaveBeenCalledWith(user, team_id, 0);
    expect(cache.get).toHaveBeenCalledWith(team_id);
    expect(http.post).toHaveBeenCalledWith('https://slack.com/api/chat.postMessage', expect.anything(), expect.anything());
    expect(res).toBeTruthy();
  });

  it('should handle seen home opened events', async () => {
    const user = 'U53R1D';
    const team_id = '734M1D';
    const res = await firstValueFrom(service.handleEvents({ event: { type: 'app_home_opened', user }, team_id }));
    expect(http.post).not.toHaveBeenCalled;
    expect(res).toBeFalsy();
  });

  it('should handle help events', async () => {
    const team_id = '734M1D';
    const res = await firstValueFrom(service.handleEvents({ event: { text: 'help' }, team_id }));
    expect(cache.get).toHaveBeenCalledWith(team_id);
    expect(http.post).toHaveBeenCalledWith('https://slack.com/api/chat.postMessage', expect.anything(), expect.anything());
    expect(res).toBeTruthy();
  });

  it('should handle status events', async () => {
    const team_id = '734M1D';
    const text = '7241';
    const res = await firstValueFrom(service.handleEvents({ event: { text }, team_id }));
    expect(status.getStatusByText).toHaveBeenCalledWith(text);
    expect(cache.get).toHaveBeenCalledWith(team_id);
    expect(http.post).toHaveBeenCalledWith('https://slack.com/api/chat.postMessage', expect.anything(), expect.anything());
    expect(res).toBeTruthy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});
