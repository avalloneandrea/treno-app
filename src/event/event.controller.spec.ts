import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { TrainPipe } from '../train/train.pipe';
import { TrainService } from '../train/train.service';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('Event Controller', () => {

  let eventService: EventService;
  let eventController: EventController;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [EventController, EventService, StationPipe, StationService, TrainPipe, TrainService]
    }).compile();
    eventService = testingModule.get<EventService>(EventService);
    eventController = testingModule.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(eventController).toBeDefined();
  });

  it('should handle url verifications events', () => {
    jest.spyOn(eventService, 'handleUrlVerifications')
      .mockImplementation(() => of(<string>'challenge'));
    eventController.handleEvents({type: 'url_verification', challenge: 'challenge'})
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs events', () => {
    jest.spyOn(eventService, 'handleBotMentionsAndDMs')
      .mockImplementation(() => of(<string>'Il treno viaggia in orario'));
    eventController.handleEvents({type: 'event_callback', event: {text: '80'}})
      .subscribe(result => expect(result).toEqual('Il treno viaggia in orario'));
  });

});
