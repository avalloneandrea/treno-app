import { Body, Controller, Post } from '@nestjs/common';

import { EventService } from './event.service';
import { Wrapper } from '../domain/wrapper.dto';

@Controller('events')
export class EventController {

  constructor(private eventService: EventService) {}

  @Post()
  handleEvents(@Body() wrapper: Wrapper) {
    switch (wrapper.type) {
      case 'url_verification':
        return this.eventService.handleUrlVerifications(wrapper);
      case 'event_callback':
        return this.eventService.handleBotMentionsAndDMs(wrapper);
    }
  }

}
