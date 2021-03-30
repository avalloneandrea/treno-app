import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';

@Injectable()
export class HttpMock {

  get(url: string): Observable<AxiosResponse> {
    if (url === 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/cercaNumeroTreno/72415')
      return of({ data: { numeroTreno: '72415', codLocOrig: '5747105' } } as AxiosResponse);
    if (url === 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/andamentoTreno/5747105/72415')
      return of({ data: { compNumeroTreno: 'REG 72415', provvedimento: 0, compRitardoAndamento: [ 'in orario' ] } } as AxiosResponse);
    return of({ data: '\n' } as AxiosResponse);
  }

  post(url: string): Observable<AxiosResponse> {
    if (url === 'https://slack.com/api/oauth.v2.access')
      return of({ data: { app_id: '4PP1D', team: {} } } as AxiosResponse);
    if (url === 'https://slack.com/api/chat.postMessage')
      return of({ data: { ok: true } } as AxiosResponse);
    return of({ data: { ok: false } } as AxiosResponse);
  }

}
