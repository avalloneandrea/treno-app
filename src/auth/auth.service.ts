import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { stringify } from 'qs';
import { map, tap } from 'rxjs/operators';

import { Grant } from '../domain/grant.dto';

@Injectable()
export class AuthService {

  constructor(@Inject(CACHE_MANAGER) private cache: Cache, private http: HttpService) {}

  handleAuthorizations(code: string) {
    const client_id = '385758389520.647264549143';
    const client_secret = process.env.CLIENT_SECRET;
    const url = 'https://slack.com/api/oauth.v2.access';
    return this.http.post(url, stringify({ code, client_id, client_secret })).pipe(
      map((response: AxiosResponse) => response.data),
      tap((grant: Grant) => console.debug(grant)),
      tap((grant: Grant) => this.cache.set(grant.team.id, grant.access_token, 0)),
      map((grant: Grant) => ({ url: `https://slack.com/app_redirect?app=${ grant.app_id }` })));
  }

}
