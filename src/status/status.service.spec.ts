import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { firstValueFrom, of } from 'rxjs';

import { StatusPipe } from './status.pipe';
import { StatusService } from './status.service';

describe('StatusService', () => {

  let http: DeepMocked<HttpService>;
  let service: StatusService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ StatusPipe, StatusService ],
    }).useMocker(createMock).compile();
    http = module.get(HttpService);
    service = module.get(StatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the status for a valid text', async () => {
    const data = { codLocOrig: 'S74710N', numeroTreno: '7241', dataPartenza: '71M3574MP' };
    http.get.mockReturnValue(of({ data } as AxiosResponse));
    const res = await firstValueFrom(service.getStatusByText('7241'));
    expect(http.get).toHaveBeenCalledWith('http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTreno/7241');
    expect(http.get).toHaveBeenCalledWith('http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/S74710N/7241/71M3574MP');
    expect(res.ok).toBeTruthy();
  });

  it('should not get the status for an invalid text', async () => {
    const data = {};
    http.get.mockReturnValue(of(data as AxiosResponse));
    const res = await firstValueFrom(service.getStatusByText('train'));
    expect(http.get).toHaveBeenCalledTimes(0);
    expect(res.ok).toBeFalsy();
  });

  it('should get the status for a valid number', async () => {
    const data = { codLocOrig: 'S74710N', numeroTreno: '7241', dataPartenza: '71M3574MP' };
    http.get.mockReturnValue(of({ data } as AxiosResponse));
    const res = await firstValueFrom(service.getStatusByNumber('7241'));
    expect(http.get).toHaveBeenCalledWith('http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTreno/7241');
    expect(http.get).toHaveBeenCalledWith('http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/S74710N/7241/71M3574MP');
    expect(res.ok).toBeTruthy();
  });

  it('should not get the status for an invalid number', async () => {
    const data = {};
    http.get.mockReturnValue(of(data as AxiosResponse));
    const res = await firstValueFrom(service.getStatusByNumber('train'));
    expect(res.ok).toBeFalsy();
  });

  it('should get the status for a valid train', async () => {
    const data = { codLocOrig: 'S74710N', numeroTreno: '7241', dataPartenza: '71M3574MP' };
    http.get.mockReturnValue(of({ data } as AxiosResponse));
    const res = await firstValueFrom(service.getStatusByTrain(data));
    expect(http.get).toHaveBeenCalledWith('http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/S74710N/7241/71M3574MP');
    expect(res.ok).toBeTruthy();
  });

  it('should not get the status for an invalid train', async () => {
    const data = {};
    http.get.mockReturnValue(of(data as AxiosResponse));
    await firstValueFrom(service.getStatusByTrain({ codLocOrig: '5T4T10N' }));
    await firstValueFrom(service.getStatusByTrain({ numeroTreno: '72415' }));
    await firstValueFrom(service.getStatusByTrain({ dataPartenza: '71M3574MP' }));
    expect(http.get).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});
