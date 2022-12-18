import { Injectable } from '@nestjs/common';
import { startCase, toLower, trim } from 'lodash';

import { Message } from '../domain/message.dto';
import { Status } from '../domain/status.dto';
import { Wrapper } from '../domain/wrapper.dto';

@Injectable()
export class MessageFactory {

  static home(wrapper: Wrapper): Message {
    return {
      channel: wrapper.event.channel,
      text: ':tada: Benvenuto in Treno! Digita il numero di un treno in circolazione per conoscere il suo andamento.',
    };
  };

  static help(wrapper: Wrapper): Message {
    return {
      channel: wrapper.event.channel,
      text: ':wave: Hai bisogno di aiuto con Treno?',
      attachments: [ {
        text: 'Digita il numero di un treno in un messaggio diretto o menzionando @treno in un canale. ' +
          'Successivamente, ti invierò informazioni in tempo reale circa il suo andamento. ' +
          'Ad esempio:\n' +
          '• "5344"\n' +
          '• "@treno 5344"\n' +
          '• "/remind #general @treno 5344 every weekday at 12:34"',
      } ],
    };
  }

  static status(wrapper: Wrapper, status: Status): Message {
    return {
      channel: wrapper.event.channel,
      text: !status.ok ? 'Treno non trovato' : [
        `Il treno ${ trim(status.compNumeroTreno) }`,
        `proveniente da ${ startCase(toLower(trim(status.origine))) } e diretto a ${ startCase(toLower(trim(status.destinazione))) }`,
        `delle ore ${ trim(status.compOrarioPartenza) }`,
        status.provvedimento === 0 ? `viaggia ${ trim(status.compRitardoAndamento[0]) }` : 'è stato cancellato',
      ].join(', '),
    };
  }

}
