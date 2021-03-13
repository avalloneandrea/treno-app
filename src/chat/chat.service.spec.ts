import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ChatService } from './chat.service';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { TrainPipe } from '../train/train.pipe';
import { TrainService } from '../train/train.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('ChatService', () => {

  let service: ChatService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: HttpService, useClass: HttpMock },
        { provide: CACHE_MANAGER, useClass: StoreMock },
        StationPipe, StationService,
        TrainPipe, TrainService
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
    service.handleBotMentionsAndDMs({ event: { text: '72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: '@treno 72415' } })
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({ event: { text: 'Remind: @treno 51427.' } })
      .subscribe(result => expect(result).toBeTruthy());
  });

});
