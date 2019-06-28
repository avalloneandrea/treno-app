import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrainPipe implements PipeTransform {

  private regExp: RegExp = /(\d+)\.?$/;

  transform(value: string): string {
    return this.regExp.test(value) ? this.regExp.exec(value)[1] : null;
  }

}
