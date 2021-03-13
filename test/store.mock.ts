import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class StoreMock {

  get(): Observable<string> {
    return of('');
  }

  set(): Observable<string> {
    return of('');
  }

}
