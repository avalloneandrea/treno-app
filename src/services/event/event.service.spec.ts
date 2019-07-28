import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpServiceMock } from '../../../test/http.service.mock';
import { StationPipe } from '../../pipes/station/station.pipe';
import { TrainPipe } from '../../pipes/train/train.pipe';
import { StationService } from '../station/station.service';
import { TrainService } from '../train/train.service';
import { EventService } from './event.service';

describe('EventService', () => {

  let service: EventService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [EventService, {provide: HttpService, useClass: HttpServiceMock}, StationPipe, StationService, TrainPipe, TrainService]
    }).compile();
    service = fixture.get(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle url verifications', () => {
    service.handleUrlVerifications({challenge: 'challenge'})
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs', () => {
    service.handleBotMentionsAndDMs({event: {text: '72415'}})
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({event: {text: '@treno 72415'}})
      .subscribe(result => expect(result).toBeTruthy());
    service.handleBotMentionsAndDMs({event: {text: 'Remind: @treno 72415.'}})
      .subscribe(result => expect(result).toBeTruthy());
  });

});
