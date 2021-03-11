import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { StationPipe } from './station.pipe';
import { StationService } from './station.service';
import { HttpServiceMock } from '../../test/http.service.mock';

describe('StationService', () => {

  let service: StationService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: HttpServiceMock },
        StationPipe, StationService
      ]
    }).compile();
    service = fixture.get(StationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the station of a valid train', () => {
    service.getAllStationsByTrain('72415')
      .subscribe(result => expect(result).toEqual([ '5747105', '5747105' ]));
    service.getFirstStationByTrain('72415')
      .subscribe(result => expect(result).toEqual('5747105'));
  });

  it('should not get the station of an invalid train', () => {
    service.getAllStationsByTrain('')
      .subscribe(result => expect(result).toEqual([]));
    service.getAllStationsByTrain('train')
      .subscribe(result => expect(result).toEqual([]));
    service.getFirstStationByTrain('')
      .subscribe(result => expect(result).toBeNull());
    service.getFirstStationByTrain('train')
      .subscribe(result => expect(result).toBeNull());
  });

});
