import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Grant } from '../domain/grant.dto';

@Injectable()
export class AuthService {

  constructor(private httpService: HttpService) {}

  authorize(code: string) {
    const url: string = 'https://slack.com/api/oauth.v2.access';
    const client_id: string = '385758389520.647264549143';
    const client_secret:string = process.env.client_secret;
    return of({ code, client_id, client_secret }).pipe(
      switchMap((grant: Grant) => this.httpService.post(url, stringify(grant))),
      map((response: AxiosResponse) => response.data),
      tap(data => console.log(data)),
      map((data: any) => ({url: data.incoming_webhook.configuration_url})))
  }

}
