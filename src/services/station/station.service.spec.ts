import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { StationPipe } from '../../pipes/station/station.pipe';
import { StationService } from './station.service';

describe('StationService', () => {

  let httpService: HttpService;
  let stationService: StationService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [StationPipe, StationService]
    }).compile();
    httpService = fixture.get(HttpService);
    stationService = fixture.get(StationService);
  });

  it('should be defined', () => {
    expect(stationService).toBeDefined();
  });

  it('should get the station of a valid train', () => {
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => of({data: '80 - VERONA PORTA NUOVA|80-S02430\n80 - BRESCIA|80-N00201\n'} as AxiosResponse));
    stationService.getAllStationsByTrain('80')
      .subscribe(result => expect(result).toEqual(['S02430', 'N00201']));
    stationService.getFirstStationByTrain('80')
      .subscribe(result => expect(result).toEqual('S02430'));
  });

  it('should not get the station of an invalid train', () => {
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => of({data: '\n'} as AxiosResponse));
    stationService.getAllStationsByTrain('00')
      .subscribe(result => expect(result).toEqual([]));
    stationService.getAllStationsByTrain('')
      .subscribe(result => expect(result).toEqual([]));
    stationService.getFirstStationByTrain('00')
      .subscribe(result => expect(result).toBeNull());
    stationService.getFirstStationByTrain('')
      .subscribe(result => expect(result).toBeNull());
  });

});
