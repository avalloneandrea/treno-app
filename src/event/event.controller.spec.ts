import { CACHE_MANAGER, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EventController } from './event.controller';
import { EventService } from './event.service';
import { StatusPipe } from '../status/status.pipe';
import { StatusService } from '../status/status.service';
import { HttpMock } from '../../test/http.mock';
import { StoreMock } from '../../test/store.mock';

describe('EventController', () => {

  let controller: EventController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CACHE_MANAGER, useClass: StoreMock },
        EventController,
        EventService,
        { provide: HttpService, useClass: HttpMock },
        StatusPipe,
        StatusService,
      ],
    }).compile();
    controller = fixture.get(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle events', () => {
    controller.handleEvents({ event: { text: '' } })
      .subscribe(result => expect(result).toBeTruthy());
  });

});
