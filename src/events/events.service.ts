import { HttpService, Injectable } from '@nestjs/common';
import { Status } from '../dto/status.interface';
import { TrainService } from '../train/train.service';
import { Message } from "./message";
import { Wrapper } from "./wrapper";

@Injectable()
export class EventsService {

  constructor(private readonly httpService: HttpService, private readonly trains: TrainService) {}

  postMessage(wrapper: Wrapper): void {
    this.trains.getStatusByText(wrapper.event.text)
      .subscribe((status: Status) => {
        const text: string = `<!here> Il treno ${status.compNumeroTreno}, proveniente da ${status.origine} e diretto a ${status.destinazione}, delle ore ${status.compOrarioPartenza}, viaggia ${status.compRitardoAndamento[0]}`;
        const message: Message = {channel: wrapper.event.channel, text: text};
        this.httpService
          .post('https://slack.com/api/chat.postMessage', message, {headers: {'Authorization': `Bearer ${process.env.token}`}})
          .subscribe();
      });
  }

}
