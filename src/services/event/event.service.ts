import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { get, startCase, toLower } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Message } from '../../dtos/message.dto';
import { Status } from '../../dtos/status.dto';
import { Wrapper } from '../../dtos/wrapper.dto';
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
        `viaggia ${get(status.compRitardoAndamento, 0)}`]
        .join(', ')),
      map((text: string) => ({channel: wrapper.event.channel, text})),
      switchMap((message: Message) => this.httpService.post(url, message, {headers: {Authorization: `Bearer ${token}`}})),
      map((response: AxiosResponse) => response.data),
      map((data: any) => `${data.status} ${data.statusText}`));
  }

}
