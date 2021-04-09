import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EventService } from './event.service';
import { StatusPipe } from '../status/status.pipe';
import { StatusService } from '../status/status.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('EventService', () => {

  let service: EventService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CACHE_MANAGER, useClass: StoreMock },
        EventService,
        { provide: HttpService, useClass: HttpMock },
        StatusPipe,
        StatusService,
      ],
    }).compile();
    service = fixture.get(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle url verifications', () => {
    service.handleEvents({ type: 'url_verification', challenge: 'challenge' })
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle home requests', () => {
    service.handleEvents({ event: { type: 'app_home_opened' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleEvents({ event: { type: 'app_home_opened', user: 'U53R' } })
      .subscribe(result => expect(result).toBeNull());
  });

  it('should handle help requests', () => {
    service.handleEvents({ event: { text: 'help' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleEvents({ event: { text: '@treno help' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleEvents({ event: { text: '/remind @treno help' } })
      .subscribe(result => expect(result).toBeTruthy());
  });

  it('should handle status requests', () => {
    service.handleEvents({ event: { text: '72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleEvents({ event: { text: '@treno 72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleEvents({ event: { text: '/remind @treno 72415' } })
      .subscribe(result => expect(result).toBeTruthy());
  });

});
