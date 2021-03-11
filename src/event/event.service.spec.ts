import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EventService } from './event.service';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { TrainPipe } from '../train/train.pipe';
import { TrainService } from '../train/train.service';
import { HttpServiceMock } from '../../test/http.service.mock';

describe('EventService', () => {

  let service: EventService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: HttpService, useClass: HttpServiceMock },
        StationPipe,
        StationService,
        TrainPipe,
        TrainService
      ]
    }).compile();
    service = fixture.get(EventService);
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
