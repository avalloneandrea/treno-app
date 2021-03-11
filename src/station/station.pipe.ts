import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StationPipe implements PipeTransform {

  private regExp = /(\w+)$/;

  transform(value: string): string {
    return this.regExp.test(value) ? this.regExp.exec(value)[1] : null;
  }

}
