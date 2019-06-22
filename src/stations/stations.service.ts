import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class StationsService {

  constructor(private readonly httpService: HttpService) {}

  getStation(train: string): Observable<string> {
    return this.getStations(train).pipe(
      map(stations => stations.length ? stations[0] : null));
  }

  getStations(train: string): Observable<Array<string>> {
    if (!this.isValidTrain(train))
      return of([]);
    return this.httpService
      .get(`http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${train}`).pipe(
        map((response: AxiosResponse) => response.data),
        map((data: string) => data.split('\n')),
        map((lines: Array<string>) => lines.map(line => this.parseStation(line))),
        map((stations: Array<string>) => stations.filter(Boolean)));
  }

  private isValidTrain(str: string): boolean {
    const regexp: RegExp = /\d+$/;
    return regexp.test(str);
  }

  private parseStation(str: string): string {
    const regexp: RegExp = /\w+$/;
    return regexp.test(str) ? regexp.exec(str)[0] : null;
  }

}
