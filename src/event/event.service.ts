import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { MessageFactory } from './message.factory';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';
import { StatusService } from '../status/status.service';

@Injectable()
export class EventService {

  constructor(@Inject(CACHE_MANAGER) private store: Cache, private http: HttpService, private service: StatusService) {}

  handleEvents(wrapper: Wrapper): Observable<string> {
    if (wrapper.type === 'url_verification')
      return this.handleUrlVerifications(wrapper);
    else if (wrapper.event.type === 'app_home_opened')
      return this.handleHomeRequests(wrapper);
    if (wrapper.event.text.endsWith('help'))
      return this.handleHelpRequests(wrapper);
    else // if (wrapper.event.type === 'message')
      return this.handleStatusRequests(wrapper);
  }

  handleUrlVerifications(wrapper: Wrapper): Observable<string> {
    return of(wrapper.challenge);
  }

  handleHomeRequests(wrapper: Wrapper): Observable<string> {
    const url = 'https://slack.com/api/chat.postMessage';
    return from(this.store.get(wrapper.event.user)).pipe(
      switchMap((ts: string) => ts !== null ? of() : this.store.set(wrapper.event.user, wrapper.event.event_ts, { ttl: 0 })),
      switchMap(() => this.store.get(wrapper.team_id)),
      switchMap((token: string) => this.http.post(url, MessageFactory.home(wrapper), { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok),
    );
  }

  handleHelpRequests(wrapper: Wrapper): Observable<string> {
    const url = 'https://slack.com/api/chat.postMessage';
    return from(this.store.get(wrapper.team_id)).pipe(
      switchMap((token: string) => this.http.post(url, MessageFactory.help(wrapper), { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok));
  }

  handleStatusRequests(wrapper: Wrapper): Observable<string> {
    const url = 'https://slack.com/api/chat.postMessage';
    return this.service.getStatusByText(wrapper.event.text).pipe(
      switchMap((status: Status) => forkJoin([ of(MessageFactory.status(wrapper, status)), this.store.get(wrapper.team_id) ])),
      switchMap(([ message, token ]) => this.http.post(url, message, { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok));
  }

}
