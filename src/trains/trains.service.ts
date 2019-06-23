import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { StationService } from '../station/station.service';
import { Status } from "./status";

@Injectable()
export class TrainsService {

  constructor(private readonly httpService: HttpService, private readonly stationService: StationService) {}

  getStatusByMessage(message: string): Observable<Status> {
    const train: string = this.parseTrain(message);
    return this.getStatusByTrain(train);
  }

  getStatusByTrain(train: string): Observable<Status> {
    return this.stationService.getFirstStationByTrain(train).pipe(
      switchMap(station => this.getStatusByStationAndTrain(station, train)));
  }

  getStatusByStationAndTrain(station: string, train: string): Observable<Status> {
    if (!station || !train)
      return of();
    return this.httpService
      .get(`http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${station}/${train}/`).pipe(
        map((response: AxiosResponse) => response.data));
  }

  private parseTrain(str: string): string {
    const regexp: RegExp = /\d+\.?$/;
    return regexp.test(str) ? regexp.exec(str)[0] : null;
  }

}
