import { Body, Controller, Post } from '@nestjs/common';

import { ChatService } from './chat.service';
import { Wrapper } from '../domain/wrapper.dto';

@Controller()
export class ChatController {

  constructor(private service: ChatService) {}

  @Post()
  handleChats(@Body() wrapper: Wrapper) {
    switch (wrapper.type) {
      case 'url_verification':
        return this.service.handleUrlVerifications(wrapper);
      case 'event_callback':
        return this.service.handleBotMentionsAndDMs(wrapper);
    }
  }

}
