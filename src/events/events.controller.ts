import { Body, Controller, Post } from '@nestjs/common';
import { Wrapper } from "./wrapper";

@Controller('events')
export class EventsController {

  @Post()
  create(@Body() wrapper: Wrapper) {
    switch (wrapper.type) {
      case 'url_verification':
        return wrapper.challenge;
    }
  }

}
