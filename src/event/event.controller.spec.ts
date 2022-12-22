import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('EventController', () => {

  let controller: EventController;
  let service: DeepMocked<EventService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ EventController ],
    }).useMocker(createMock).compile();
    controller = module.get(EventController);
    service = module.get(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle events', () => {
    const wrapper = { event: { text: '7541' } };
    controller.handleEvents(wrapper);
    expect(service.handleEvents).toHaveBeenCalledWith(wrapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});
