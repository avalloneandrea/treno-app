import { CACHE_MANAGER, CacheModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { TrainPipe } from '../train/train.pipe';
import { TrainService } from '../train/train.service';
import { HttpServiceMock } from '../../test/http.service.mock';

describe('ChatController', () => {

  let controller: ChatController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      imports: [ CacheModule.register() ],
      providers: [
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(() => 'VALUE'), set: jest.fn() } },
        ChatController, ChatService,
        { provide: HttpService, useClass: HttpServiceMock },
        StationPipe, StationService,
        TrainPipe, TrainService
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
