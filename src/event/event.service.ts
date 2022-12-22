import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { defaultIfEmpty, filter, forkJoin, from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { MessageFactory } from './message.factory';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';
import { StatusService } from '../status/status.service';

@Injectable()
export class EventService {

  constructor(@Inject(CACHE_MANAGER) private cache: Cache, private http: HttpService, private service: StatusService) {}

  handleEvents(wrapper: Wrapper): Observable<any> {
    if (wrapper.type === 'url_verification')
      return this.handleUrlVerificationEvents(wrapper);
    if (wrapper.event.bot_id)
      return this.handleBotMessageEvents(wrapper);
    else if (wrapper.event.type === 'app_home_opened')
      return this.handleHomeOpenedEvents(wrapper);
    if (wrapper.event.text.endsWith('help'))
      return this.handleHelpEvents(wrapper);
    else // if (wrapper.event.type === 'message')
      return this.handleStatusEvents(wrapper);
  }

  handleUrlVerificationEvents(wrapper: Wrapper): Observable<string> {
    return of(wrapper.challenge);
  }

  handleBotMessageEvents(wrapper: Wrapper): Observable<boolean> {
    return of(false);
  }

  handleHomeOpenedEvents(wrapper: Wrapper): Observable<boolean> {
    const url = 'https://slack.com/api/chat.postMessage';
    return from(this.cache.get(wrapper.event.user)).pipe(
      filter((teamId: string) => teamId === null),
      tap(() => this.cache.set(wrapper.event.user, wrapper.team_id, 0)),
      switchMap(() => this.cache.get(wrapper.team_id)),
      filter((token: string) => token !== null),
      switchMap((token: string) => this.http.post(url, MessageFactory.homeOpened(wrapper), { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok),
      defaultIfEmpty(false));
  }

  handleHelpEvents(wrapper: Wrapper): Observable<boolean> {
    const url = 'https://slack.com/api/chat.postMessage';
    return from(this.cache.get(wrapper.team_id)).pipe(
      filter((token: string) => token !== null),
      switchMap((token: string) => this.http.post(url, MessageFactory.help(wrapper), { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok),
      defaultIfEmpty(of(false)));
  }

  handleStatusEvents(wrapper: Wrapper): Observable<boolean> {
    const url = 'https://slack.com/api/chat.postMessage';
    return this.service.getStatusByText(wrapper.event.text).pipe(
      switchMap((status: Status) => forkJoin([ of(MessageFactory.status(wrapper, status)), this.cache.get(wrapper.team_id) ])),
      filter(([ message, token ]) => token !== null),
      switchMap(([ message, token ]) => this.http.post(url, message, { headers: { Authorization: `Bearer ${ token }` } })),
      map((response: AxiosResponse) => response.data),
      tap((data: any) => console.debug(data)),
      map((data: any) => data.ok),
      defaultIfEmpty(of(false)));
  }

}
