import { Injectable, PipeTransform } from '@nestjs/common';
import { startCase, toLower } from 'lodash';

import { Status } from '../domain/status.dto';

@Injectable()
export class ChatPipe implements PipeTransform {

  transform(status: Status) {
    if (!status.ok)
      return 'Treno non trovato!';
    else return [
      `Il treno ${ status.compNumeroTreno }`,
      `proveniente da ${ startCase(toLower(status.origine)) } e diretto a ${ startCase(toLower(status.destinazione)) }`,
      `delle ore ${ status.compOrarioPartenza }`,
      status.provvedimento === 0 ? `viaggia ${ status.compRitardoAndamento[0] }` : 'è stato cancellato'
    ].join(', ')
  }

}
