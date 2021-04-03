import { Injectable, PipeTransform } from '@nestjs/common';
import { startCase, toLower } from 'lodash';

import { Attachment } from '../domain/attachment.dto';
import { Status } from '../domain/status.dto';

@Injectable()
export class ChatPipe implements PipeTransform {

  transform(status: Status): string {
    if (!status.ok)
      return 'Treno non trovato';
    else return [
      `Il treno ${ status.compNumeroTreno }`,
      `proveniente da ${ startCase(toLower(status.origine)) } e diretto a ${ startCase(toLower(status.destinazione)) }`,
      `delle ore ${ status.compOrarioPartenza }`,
      status.provvedimento === 0 ? `viaggia ${ status.compRitardoAndamento[0] }` : 'è stato cancellato'
    ].join(', ');
  }

  help(): Attachment {
    return {
      pretext: ':wave: Hai bisogno di aiuto con Treno?',
      text: 'Digita il numero di un treno in un messaggio diretto o menzionando @treno in un canale. '
        + 'Successivamente, ti invierò informazioni in tempo reale circa il suo andamento. '
        + 'Ad esempio:\n'
        + '• "5344"\n'
        + '• "@treno 5344"\n'
        + '• "/remind #general @treno 5344 every weekday at 12:34"'
    };
  }

}
