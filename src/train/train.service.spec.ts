import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { StationPipe } from '../station/station.pipe';
import { StationService } from '../station/station.service';
import { TrainPipe } from './train.pipe';
import { TrainService } from './train.service';

describe('TrainService', () => {

  let httpService: HttpService;
  let stationService: StationService;
  let trainService: TrainService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [StationPipe, StationService, TrainPipe, TrainService]
    }).compile();
    httpService = testingModule.get<HttpService>(HttpService);
    stationService = testingModule.get<StationService>(StationService);
    trainService = testingModule.get<TrainService>(TrainService);
  });

  it('should be defined', () => {
    expect(trainService).toBeDefined();
  });

  it('should get the status of a valid station and train', () => {
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => of(<AxiosResponse>{data: {compNumeroTreno: 'EC 80'}}));
    trainService.getStatusByStationAndTrain('S02430', '80')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('EC 80'));
  });

  it('should not get the status of an invalid station or train', () => {
    trainService.getStatusByStationAndTrain('S02430', '')
      .subscribe(result => expect(result).toBeNull());
    trainService.getStatusByStationAndTrain('', '80')
      .subscribe(result => expect(result).toBeNull());
  });

  it('should get the status of a valid train', () => {
    jest.spyOn(stationService, 'getFirstStationByTrain')
      .mockImplementation(() => of('S02430'));
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => of(<AxiosResponse>{data: {compNumeroTreno: 'EC 80'}}));
    trainService.getStatusByTrain('80')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('EC 80'));
  });

  it('should get the status of a valid text', () => {
    jest.spyOn(stationService, 'getFirstStationByTrain')
      .mockImplementation(() => of('S02430'));
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => of(<AxiosResponse>{data: {compNumeroTreno: 'EC 80'}}));
    trainService.getStatusByText('80')
      .subscribe(result => expect(result.compNumeroTreno).toEqual('EC 80'));
  });

});
