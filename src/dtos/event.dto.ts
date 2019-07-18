import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class Event {

  @ApiModelPropertyOptional()
  channel?: string;

  @ApiModelPropertyOptional()
  text?: string;

}
