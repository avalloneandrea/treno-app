import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { StatusPipe } from './status.pipe';
import { StatusService } from './status.service';
import { HttpMock } from '../../test/http.mock';

describe('StatusService', () => {

  let service: StatusService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: HttpMock },
        StatusPipe, StatusService,
      ],
    }).compile();
    service = fixture.get(StatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the status of a valid train', () => {
    service.getStatusByTrain({ codLocOrig: '5747105', numeroTreno: '72415', dataPartenza: '71M3574MP' })
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
  });

  it('should not get the status of an invalid train', () => {
    service.getStatusByTrain({ codLocOrig: '5747105' })
      .subscribe(result => expect(result.ok).toBeFalsy());
    service.getStatusByTrain({ numeroTreno: '72415' })
      .subscribe(result => expect(result.ok).toBeFalsy());
    service.getStatusByTrain({ dataPartenza: '71M3574MP' })
      .subscribe(result => expect(result.ok).toBeFalsy());
  });

  it('should get the status of a valid number', () => {
    service.getStatusByNumber('72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
  });

  it('should not get the status of an invalid number', () => {
    service.getStatusByNumber('51427')
      .subscribe(result => expect(result.ok).toBeFalsy());
  });

  it('should get the status of a valid text', () => {
    service.getStatusByText('72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
    service.getStatusByText('@treno 72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
    service.getStatusByText('Remind: @treno 72415.')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
  });

  it('should not get the status of an invalid text', () => {
    service.getStatusByText('')
      .subscribe(result => expect(result.ok).toBeNull());
  });

});
