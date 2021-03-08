import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EventController } from './event.controller';
import { EventService } from './event.service';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { TrainPipe } from '../train/train.pipe';
import { TrainService } from '../train/train.service';
import { HttpServiceMock } from '../../test/http.service.mock';

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
