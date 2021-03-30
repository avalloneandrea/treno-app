import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StatusPipe implements PipeTransform {

  private regExp = /(\d+)\.?$/;

  transform(value: string): string {
    return this.regExp.test(value) ? this.regExp.exec(value)[1] : null;
  }

}
