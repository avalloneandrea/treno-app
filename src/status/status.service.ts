import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { StatusPipe } from './status.pipe';
import { Status } from '../domain/status.dto';
import { Train } from '../domain/train.dto';

@Injectable()
export class StatusService {

  constructor(private http: HttpService, private pipe: StatusPipe) {}

  getStatusByText(text: string): Observable<Status> {
    const number: string = this.pipe.transform(text);
    return this.getStatusByNumber(number);
  }

  getStatusByNumber(number: string): Observable<Status> {
    if (!number)
      return of();
    const url = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTreno/${ number }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => Object.assign({ ok: true }, response.data)),
      switchMap((train: Train) => this.getStatusByTrain(train)));
  }

  getStatusByTrain({ codLocOrig, numeroTreno, dataPartenza }: Train): Observable<Status> {
    if (!codLocOrig || !numeroTreno || !dataPartenza)
      return of({ ok: false });
    const url = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/${ codLocOrig }/${ numeroTreno }/${ dataPartenza }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => Object.assign({ ok: true }, response.data)));
  }

}
