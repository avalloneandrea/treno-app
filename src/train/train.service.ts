import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TrainPipe } from './train.pipe';
import { Status } from '../domain/status.dto';
import { StationService } from '../station/station.service';

@Injectable()
export class TrainService {

  constructor(private http: HttpService, private service: StationService, private pipe: TrainPipe) {}

  getStatusByStationAndTrain(station: string, train: string): Observable<Status> {
    if (!station || !train)
      return of();
    const url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${ station }/${ train }`;
    return this.http.get(url).pipe(
      map((response: AxiosResponse) => response.data));
  }

  getStatusByTrain(train: string): Observable<Status> {
    return this.service.getFirstStationByTrain(train).pipe(
      switchMap((station: string) => this.getStatusByStationAndTrain(station, train)));
  }

  getStatusByText(text: string): Observable<Status> {
    const train: string = this.pipe.transform(text);
    return this.getStatusByTrain(train);
  }

}
