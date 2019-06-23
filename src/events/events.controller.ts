import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from "./events.service";
import { Wrapper } from "./wrapper";

@Controller('events')
export class EventsController {

  constructor(private readonly events: EventsService) {}

  @Post()
  create(@Body() wrapper: Wrapper) {
    switch (wrapper.type) {
      case 'url_verification':
        return wrapper.challenge;
      case 'event_callback':
        this.events.postMessage(wrapper);
    }
  }

}
