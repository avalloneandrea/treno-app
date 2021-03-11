import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TrainPipe } from './train.pipe';
import { TrainService } from './train.service';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { HttpServiceMock } from '../../test/http.service.mock';

describe('TrainService', () => {

  let service: TrainService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: HttpServiceMock },
        StationPipe,
        StationService,
        TrainPipe,
        TrainService
      ]
    }).compile();
    service = fixture.get(TrainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the status of a valid station and train', () => {
    service.getStatusByStationAndTrain('5747105', '72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
  });

  it('should not get the status of an invalid station or train', () => {
    service.getStatusByStationAndTrain('5747105', '')
      .subscribe(result => expect(result).toBeNull());
    service.getStatusByStationAndTrain('', '72415')
      .subscribe(result => expect(result).toBeNull());
  });

  it('should get the status of a valid train', () => {
    service.getStatusByTrain('72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
  });

  it('should get the status of a valid text', () => {
    service.getStatusByText('72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
    service.getStatusByText('@treno 72415')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
    service.getStatusByText('Remind: @treno 72415.')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('REG 72415'));
  });

});
