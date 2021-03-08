import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { startCase, toLower } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Message } from '../domain/message.dto';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';
import { TrainService } from '../train/train.service';

@Injectable()
export class EventService {

  constructor(private httpService: HttpService, private trainService: TrainService) {}

  handleUrlVerifications(wrapper: Wrapper): Observable<string> {
    return of(wrapper.challenge);
  }

  handleBotMentionsAndDMs(wrapper: Wrapper): Observable<string> {
    const url: string = 'https://slack.com/api/chat.postMessage';
    const token: string = process.env.token;
    return this.trainService.getStatusByText(wrapper.event.text).pipe(
      map((status: Status) => [
        `Il treno ${status.compNumeroTreno}`,
        `proveniente da ${startCase(toLower(status.origine))} e diretto a ${startCase(toLower(status.destinazione))}`,
        `delle ore ${status.compOrarioPartenza}`,
        `${this.getAndamento(status)}`]
        .join(', ')),
      map((text: string) => ({channel: wrapper.event.channel, text})),
      switchMap((message: Message) => this.httpService.post(url, message, {headers: {Authorization: `Bearer ${token}`}})),
      map((response: AxiosResponse) => response.data),
      tap(data => console.log(data)),
      map((data: any) => data.ok));
  }

  private getAndamento(status: Status): string {
    const isCircolante: boolean = status.provvedimento === 0;
    return isCircolante ? `viaggia ${status.compRitardoAndamento[0]}` : 'è stato cancellato';
  }

}
