import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { stringify } from 'qs';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Grant } from '../domain/grant.dto';

@Injectable()
export class AuthService {

  constructor(@Inject(CACHE_MANAGER) private store: Cache, private http: HttpService) {}

  authorize(code: string) {
    const url = 'https://slack.com/api/oauth.v2.access';
    const client_id = '385758389520.647264549143';
    const client_secret: string = process.env.CLIENT_SECRET;
    return of({ code, client_id, client_secret }).pipe(
      switchMap((grant: Grant) => this.http.post(url, stringify(grant))),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      tap(data => this.store.set(data.team.id, data.access_token, { ttl: 0 })),
      map((data: any) => ({ url: `https://slack.com/app_redirect?app=${ data.app_id }` })));
  }

}
