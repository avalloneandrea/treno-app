import { Body, Controller, Post } from '@nestjs/common';
import { Wrapper } from '../../dtos/wrapper.dto';
import { EventService } from '../../services/event/event.service';

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
