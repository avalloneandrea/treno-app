import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Message } from '../dto/message.interface';
import { Status } from '../dto/status.interface';
import { Wrapper } from '../dto/wrapper.interface';
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
      map((status: Status) => `Il treno ${status.compNumeroTreno}, proveniente da ${status.origine} e diretto a ${status.destinazione}, delle ore ${status.compOrarioPartenza}, viaggia ${status.compRitardoAndamento[0]}`),
      map((text: string) => ({channel: wrapper.event.channel, text})),
      switchMap((message: Message) => this.httpService.post(url, message, {headers: {Authorization: `Bearer ${token}`}})),
      map((response: AxiosResponse) => response.data),
      map((data: any) => `${data.status} ${data.statusText}`));
  }

}
