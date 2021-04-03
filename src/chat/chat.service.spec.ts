import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ChatPipe } from './chat.pipe';
import { ChatService } from './chat.service';
import { StatusPipe } from '../status/status.pipe';
import { StatusService } from '../status/status.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('ChatService', () => {

  let service: ChatService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        ChatPipe, ChatService,
        { provide: HttpService, useClass: HttpMock },
        { provide: CACHE_MANAGER, useClass: StoreMock },
        StatusPipe, StatusService
      ]
    }).compile();
    service = fixture.get(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle url verifications', () => {
    service.handleUrlVerifications({ challenge: 'challenge' })
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs', () => {
    service.handleBotMentionsAndDMs({ event: { text: 'help' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: '@treno help' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: '/remind @treno help' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: '72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: '@treno 72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: '/remind @treno 72415' } })
      .subscribe(result => expect(result).toBeTruthy());
  });

});
