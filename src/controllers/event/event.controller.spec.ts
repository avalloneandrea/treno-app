import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { StationPipe } from '../../pipes/station/station.pipe';
import { TrainPipe } from '../../pipes/train/train.pipe';
import { EventService } from '../../services/event/event.service';
import { StationService } from '../../services/station/station.service';
import { TrainService } from '../../services/train/train.service';
import { EventController } from './event.controller';

describe('Event Controller', () => {

  let eventService: EventService;
  let eventController: EventController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [EventController, EventService, StationPipe, StationService, TrainPipe, TrainService]
    }).compile();
    eventService = fixture.get(EventService);
    eventController = fixture.get(EventController);
  });

  it('should be defined', () => {
    expect(eventController).toBeDefined();
  });

  it('should handle url verifications', () => {
    jest.spyOn(eventService, 'handleUrlVerifications')
      .mockImplementation(() => of('challenge'));
    eventController.handleEvents({type: 'url_verification', challenge: 'challenge'})
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs', () => {
    jest.spyOn(eventService, 'handleBotMentionsAndDMs')
      .mockImplementation(() => of('200 OK'));
    eventController.handleEvents({type: 'event_callback', event: {text: '@treno 80'}})
      .subscribe(result => expect(result).toEqual('200 OK'));
  });

});
