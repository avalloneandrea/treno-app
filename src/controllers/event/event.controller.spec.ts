import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpServiceMock } from '../../../test/http.service.mock';
import { StationPipe } from '../../pipes/station/station.pipe';
import { TrainPipe } from '../../pipes/train/train.pipe';
import { EventService } from '../../services/event/event.service';
import { StationService } from '../../services/station/station.service';
import { TrainService } from '../../services/train/train.service';
import { EventController } from './event.controller';

describe('EventController', () => {

  let controller: EventController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        EventController, EventService,
        {provide: HttpService, useClass: HttpServiceMock},
        StationPipe, StationService,
        TrainPipe, TrainService
      ]
    }).compile();
    controller = fixture.get(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle url verifications', () => {
    controller.handleEvents({type: 'url_verification', challenge: 'challenge'})
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs', () => {
    controller.handleEvents({type: 'event_callback', event: {text: '72415'}})
      .subscribe(result => expect(result).toBeTruthy());
    controller.handleEvents({type: 'event_callback', event: {text: '@treno 72415'}})
      .subscribe(result => expect(result).toBeTruthy());
    controller.handleEvents({type: 'event_callback', event: {text: 'Remind: @treno 72415.'}})
      .subscribe(result => expect(result).toBeTruthy());
  });

});
