import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { startCase, toLower } from 'lodash';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Message } from '../domain/message.dto';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';
import { TrainService } from '../train/train.service';

@Injectable()
export class ChatService {

  constructor(@Inject(CACHE_MANAGER) private tokens: Cache, private http: HttpService, private service: TrainService) {}

  handleUrlVerifications(wrapper: Wrapper): Observable<string> {
    return of(wrapper.challenge);
  }

  handleBotMentionsAndDMs(wrapper: Wrapper): Observable<string> {
    const url = 'https://slack.com/api/chat.postMessage';
    return this.service.getStatusByText(wrapper.event.text).pipe(
      map((status: Status) => this.toText(status)),
      map((text: string) => ({ channel: wrapper.event.channel, text })),
      switchMap((message: Message) => forkJoin([ of(message), this.tokens.get(wrapper.team_id) ])),
      switchMap(([ message, token ]) => this.http.post(url, message, { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.log(data)),
      map((data: any) => data.ok));
  }

  private toText(status: Status): string {
    return [
      `Il treno ${ status.compNumeroTreno }`,
      `proveniente da ${ startCase(toLower(status.origine)) } e diretto a ${ startCase(toLower(status.destinazione)) }`,
      `delle ore ${ status.compOrarioPartenza }`,
      status.provvedimento === 0 ? `viaggia ${ status.compRitardoAndamento[0] }` : 'è stato cancellato'
    ].join(', ')
  }

}
