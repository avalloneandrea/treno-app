import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class Status {

  @ApiModelPropertyOptional()
  compNumeroTreno?: string;

  @ApiModelPropertyOptional()
  origine?: string;

  @ApiModelPropertyOptional()
  destinazione?: string;

  @ApiModelPropertyOptional()
  compOrarioPartenza?: string;

  @ApiModelPropertyOptional()
  compOrarioArrivo?: string;

  @ApiModelPropertyOptional()
  compRitardoAndamento?: string[];

}
