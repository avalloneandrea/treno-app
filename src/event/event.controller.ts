import { Body, Controller, Post } from '@nestjs/common';

import { EventService } from './event.service';
import { Wrapper } from '../domain/wrapper.dto';

@Controller()
export class EventController {

  constructor(private service: EventService) {}

  @Post()
  handleEvents(@Body() wrapper: Wrapper) {
    return this.service.handleEvents(wrapper);
  }

}
