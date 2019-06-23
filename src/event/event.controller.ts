import { Body, Controller, Post } from '@nestjs/common';
import { Wrapper } from '../dto/wrapper.interface';
import { EventService } from './event.service';

@Controller('events')
export class EventController {

  constructor(private eventService: EventService) {}

  @Post()
  create(@Body() wrapper: Wrapper) {
    switch (wrapper.type) {
      case 'url_verification':
        return this.eventService.handleUrlVerification(wrapper);
      case 'event_callback':
        return this.eventService.handleBotMentionsAndDMs(wrapper);
    }
  }

}
