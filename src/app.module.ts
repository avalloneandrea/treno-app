import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { StationPipe } from './station/station.pipe';
import { StationService } from './station/station.service';
import { TrainPipe } from './train/train.pipe';
import { TrainService } from './train/train.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, EventController],
  providers: [
    AppService,
    EventService,
    StationPipe,
    StationService,
    TrainPipe,
    TrainService
  ]
})
export class AppModule {}
