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

  getStatusByStationAndTrain(station: string, train: string): Observable<Status> {
    if (!station || !train)
      return of({ ok: false });
    const url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${ station }/${ train }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => response.data));
  }

  getStatusByTrain(train: string): Observable<Status> {
    if (!train)
      return of({ ok: false });
    const url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTreno/${ train }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => Object.assign({ ok: true }, response.data)),
      switchMap((train: Train) => this.getStatusByStationAndTrain(train.codLocOrig, train.numeroTreno)));
  }

  getStatusByText(text: string): Observable<Status> {
    const train: string = this.pipe.transform(text);
    return this.getStatusByTrain(train);
  }

}
