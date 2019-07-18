import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Event } from './event.dto';

export class Wrapper {

  @ApiModelPropertyOptional()
  challenge?: string;

  @ApiModelPropertyOptional()
  event?: Event;

  @ApiModelPropertyOptional()
  event_id?: string;

  @ApiModelPropertyOptional()
  type?: string;

}
