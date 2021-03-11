import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StationPipe } from './station.pipe';

@Injectable()
export class StationService {

  constructor(private httpService: HttpService, private stationPipe: StationPipe) {}

  getAllStationsByTrain(train: string): Observable<string[]> {
    if (!train)
      return of();
    const url = `http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${ train }`;
    return this.httpService.get(url).pipe(
      map((response: AxiosResponse) => response.data),
      map((data: string) => data.split('\n')),
      map((lines: string[]) => lines.map(line => this.stationPipe.transform(line))),
      map((stations: string[]) => stations.filter(Boolean)));
  }

  getFirstStationByTrain(train: string): Observable<string> {
    return this.getAllStationsByTrain(train).pipe(
      map((stations: string[]) => stations.length ? stations[0] : null));
  }

}
