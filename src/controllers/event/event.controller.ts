import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Wrapper } from '../../dtos/wrapper.dto';
import { EventService } from '../../services/event/event.service';

@ApiUseTags('Events')
@Controller('events')
export class EventController {

  constructor(private eventService: EventService) {}

  @Post()
  @ApiOperation({title: 'Handle a Slack event'})
  @ApiOkResponse({description: 'The event has been successfully received'})
  handleEvents(@Body() wrapper: Wrapper) {
    switch (wrapper.type) {
      case 'url_verification':
        return this.eventService.handleUrlVerifications(wrapper);
      case 'event_callback':
        return this.eventService.handleBotMentionsAndDMs(wrapper);
    }
  }

}
