import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class StoreMock {

  get(key: string): Observable<string> {
    return key === 'U53R' ? of('71M3574MP') : of(null);
  }

  set(): Observable<string> {
    return of(null);
  }

}
