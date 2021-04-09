import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { StatusPipe } from './status.pipe';
import { StatusService } from './status.service';
import { Status } from '../domain/status.dto';
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

  it('should get the status for a valid text', () => {
    service.getStatusByText('72415')
      .subscribe((result: Status) => expect(result.ok).toBeTruthy());
    service.getStatusByText('@treno 72415')
      .subscribe((result: Status) => expect(result.ok).toBeTruthy());
    service.getStatusByText('Remind: @treno 72415.')
      .subscribe((result: Status) => expect(result.ok).toBeTruthy());
  });

  it('should not get the status for an invalid text', () => {
    service.getStatusByText('train')
      .subscribe((result: Status) => expect(result).toBeNull());
  });

  it('should get the status for a valid number', () => {
    service.getStatusByNumber('72415')
      .subscribe((result: Status) => expect(result.ok).toBeTruthy());
  });

  it('should not get the status for an invalid number', () => {
    service.getStatusByNumber('train')
      .subscribe((result: Status) => expect(result.ok).toBeFalsy());
  });

  it('should get the status for a valid train', () => {
    service.getStatusByTrain({ codLocOrig: '5747105', numeroTreno: '72415', dataPartenza: '71M3574MP' })
      .subscribe((result: Status) => expect(result.ok).toBeTruthy());
  });

  it('should not get the status for an invalid train', () => {
    service.getStatusByTrain({ codLocOrig: '5747105' })
      .subscribe((result: Status) => expect(result.ok).toBeFalsy());
    service.getStatusByTrain({ numeroTreno: '72415' })
      .subscribe((result: Status) => expect(result.ok).toBeFalsy());
    service.getStatusByTrain({ dataPartenza: '71M3574MP' })
      .subscribe((result: Status) => expect(result.ok).toBeFalsy());
  });

});
