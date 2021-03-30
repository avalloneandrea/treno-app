import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ChatController } from './chat.controller';
import { ChatPipe } from './chat.pipe';
import { ChatService } from './chat.service';
import { StatusPipe } from '../status/status.pipe';
import { StatusService } from '../status/status.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('ChatController', () => {

  let controller: ChatController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CACHE_MANAGER, useClass: StoreMock },
        ChatController, ChatPipe, ChatService,
        { provide: HttpService, useClass: HttpMock },
        StatusPipe, StatusService
      ]
    }).compile();
    controller = fixture.get(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle url verifications', () => {
    controller.handleChats({ type: 'url_verification', challenge: 'challenge' })
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs', () => {
    controller.handleChats({ type: 'event_callback', event: { text: '72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    controller.handleChats({ type: 'event_callback', event: { text: '@treno 72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    controller.handleChats({ type: 'event_callback', event: { text: 'Remind: @treno 72415.' } })
      .subscribe(result => expect(result).toBeTruthy());
  });

});
