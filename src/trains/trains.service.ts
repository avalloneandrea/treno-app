import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { StationsService } from "../stations/stations.service";
import { Status } from "./status";

@Injectable()
export class TrainsService {

  constructor(private readonly httpService: HttpService, private readonly stations: StationsService) {}

  getStatusByTrain(train: string): Observable<Status> {
    return this.stations.getStation(train).pipe(
      switchMap(station => this.getStatusByStationAndTrain(station, train)));
  }

  getStatusByStationAndTrain(station: string, train: string): Observable<Status> {
    if (!station || !train)
      return null;
    return this.httpService
      .get(`http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/${station}/${train}/`).pipe(
        map((response: AxiosResponse) => response.data));
  }

}
