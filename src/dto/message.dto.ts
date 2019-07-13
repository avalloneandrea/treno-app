import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class Message {

  @ApiModelPropertyOptional()
  channel?: string;

  @ApiModelPropertyOptional()
  text?: string;

}
