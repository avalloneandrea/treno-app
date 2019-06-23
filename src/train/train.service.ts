import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Status } from '../dto/status.interface';
import { StationService } from '../station/station.service';
import { TrainPipe } from './train.pipe';

@Injectable()
export class TrainService {

  constructor(private httpService: HttpService, private stationService: StationService, private trainPipe: TrainPipe) {}

  getStatusByStationAndTrain(station: string, train: string): Observable<Status> {
    if (!station || !train)
      return of();
    const url: string = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${station}/${train}/`;
    return this.httpService.get(url).pipe(
      map((response: AxiosResponse) => response.data));
  }

  getStatusByTrain(train: string): Observable<Status> {
    return this.stationService.getFirstStationByTrain(train).pipe(
      switchMap((station: string) => this.getStatusByStationAndTrain(station, train)));
  }

  getStatusByText(text: string): Observable<Status> {
    const train: string = this.trainPipe.transform(text);
    return this.getStatusByTrain(train);
  }

}
