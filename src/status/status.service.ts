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

  getStatusByTrain({ codLocOrig, numeroTreno, dataPartenza }: Train): Observable<Status> {
    if (!codLocOrig || !numeroTreno || !dataPartenza)
      return of({ ok: false });
    const url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${ codLocOrig }/${ numeroTreno }/${ dataPartenza }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => Object.assign({ ok: true }, response.data)));
  }

  getStatusByNumber(number: string): Observable<Status> {
    if (!number)
      return of();
    const url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTreno/${ number }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => Object.assign({ ok: true }, response.data)),
      switchMap((train: Train) => this.getStatusByTrain(train)));
  }

  getStatusByText(text: string): Observable<Status> {
    const train: string = this.pipe.transform(text);
    return this.getStatusByNumber(train);
  }

}
