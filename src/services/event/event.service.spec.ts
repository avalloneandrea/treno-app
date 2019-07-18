import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Status } from '../../dtos/status.dto';
import { StationPipe } from '../../pipes/station/station.pipe';
import { TrainPipe } from '../../pipes/train/train.pipe';
import { StationService } from '../station/station.service';
import { TrainService } from '../train/train.service';
import { EventService } from './event.service';

describe('EventService', () => {

  let httpService: HttpService;
  let trainService: TrainService;
  let eventService: EventService;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [EventService, StationPipe, StationService, TrainPipe, TrainService]
    }).compile();
    httpService = fixture.get(HttpService);
    trainService = fixture.get(TrainService);
    eventService = fixture.get(EventService);
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
  });

  it('should handle url verifications', () => {
    eventService.handleUrlVerifications({challenge: 'challenge'})
      .subscribe(result => expect(result).toEqual('challenge'));
  });

  it('should handle bot mentions and DMs', () => {
    const status: Status = {
      compNumeroTreno: 'EC 80',
      origine: 'VERONA PORTA NUOVA',
      destinazione: 'BRENNERO',
      compOrarioPartenza: '11:00',
      compOrarioArrivo: '14:00',
      compRitardoAndamento: ['in orario']
    };
    jest.spyOn(trainService, 'getStatusByText')
      .mockImplementation(() => of(status));
    jest.spyOn(httpService, 'post')
      .mockImplementation(() => of({data: {status: '200', statusText: 'OK'}} as AxiosResponse));
    eventService.handleBotMentionsAndDMs({event: {text: '80'}})
      .subscribe(result => expect(result).toEqual('200 OK'));
  });

});
