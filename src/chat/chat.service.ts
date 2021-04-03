import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ChatPipe } from './chat.pipe';
import { Message } from '../domain/message.dto';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';
import { StatusService } from '../status/status.service';

@Injectable()
export class ChatService {

  constructor(@Inject(CACHE_MANAGER) private store: Cache, private pipe: ChatPipe, private http: HttpService, private service: StatusService) {}

  handleUrlVerifications(wrapper: Wrapper): Observable<string> {
    return of(wrapper.challenge);
  }

  handleBotMentionsAndDMs(wrapper: Wrapper): Observable<string> {
    if (wrapper.event.text.endsWith('help'))
      return this.handleHelpRequests(wrapper);
    return this.handleStatusRequests(wrapper);
  }

  handleHelpRequests(wrapper: Wrapper): Observable<string> {
    const url = 'https://slack.com/api/chat.postMessage';
    const message: Message = {
      channel: wrapper.event.channel,
      attachments: [ this.pipe.help() ],
    };
    return from(this.store.get(wrapper.team_id)).pipe(
      switchMap(token => this.http.post(url, message, { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok));
  }

  handleStatusRequests(wrapper: Wrapper): Observable<string> {
    const url = 'https://slack.com/api/chat.postMessage';
    return this.service.getStatusByText(wrapper.event.text).pipe(
      map((status: Status) => this.pipe.transform(status)),
      map((text: string) => ({ channel: wrapper.event.channel, text })),
      switchMap((message: Message) => forkJoin([ of(message), this.store.get(wrapper.team_id) ])),
      switchMap(([ message, token ]) => this.http.post(url, message, { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok));
  }

}
