import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';

@Injectable()
export class HttpServiceMock {

  get(url: string): Observable<AxiosResponse> {
    if (url === 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/72415')
      return of({ data: '72415 - FIRST STATION|72415-5747105\n72415 - SECOND STATION|72415-5747105' } as AxiosResponse);
    if (url === 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/5747105/72415')
      return of({ data: { compNumeroTreno: 'REG 72415', provvedimento: 0, compRitardoAndamento: [ 'in orario' ] } } as AxiosResponse);
    if (url === 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/51427')
      return of({ data: '51427 - FIRST STATION|51427-5017475\n51427 - SECOND STATION|51427-5017475' } as AxiosResponse);
    if (url === 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/5017475/51427')
      return of({ data: { compNumeroTreno: 'REG 51427', provvedimento: 1, compRitardoAndamento: [ 'in orario' ] } } as AxiosResponse);
    return of({ data: '\n' } as AxiosResponse);
  }

  post(url: string): Observable<AxiosResponse> {
    if (url === 'https://slack.com/api/chat.postMessage')
      return of({ data: { ok: true } } as AxiosResponse);
    if (url === 'https://slack.com/api/oauth.v2.access')
      return of({ data: { incoming_webhook: { configuration_url: 'www.redirect.url' } } } as AxiosResponse);
    return of({ data: { ok: false } } as AxiosResponse);
  }

}
