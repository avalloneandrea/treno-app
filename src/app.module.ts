import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { StationPipe } from './station/station.pipe';
import { StationService } from './station/station.service';
import { TrainPipe } from './train/train.pipe';
import { TrainService } from './train/train.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, EventsController],
  providers: [
    AppService,
    EventsService,
    StationPipe,
    StationService,
    TrainPipe,
    TrainService
  ]
})
export class AppModule {}
