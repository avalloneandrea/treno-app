import { HttpService, Injectable } from '@nestjs/common';
import { Message } from "./message";
import { Status } from "../trains/status";
import { TrainsService } from "../trains/trains.service";
import { Wrapper } from "./wrapper";

@Injectable()
export class EventsService {

  constructor(private readonly httpService: HttpService, private readonly trains: TrainsService) {}

  postMessage(wrapper: Wrapper): void {
    this.trains.getStatusByMessage(wrapper.event.text)
      .subscribe((status: Status) => {
        const text: string = `<!here> Il treno ${status.compNumeroTreno}, proveniente da ${status.origine} e diretto a ${status.destinazione}, delle ore ${status.compOrarioPartenza}, viaggia ${status.compRitardoAndamento[0]}`;
        const message: Message = {channel: wrapper.event.channel, text: text};
        this.httpService
          .post('https://slack.com/api/chat.postMessage', message, {headers: {'Authorization': `Bearer ${process.env.token}`}})
          .subscribe();
      });
  }

}
