import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { StationsService } from './stations/stations.service';
import { TrainsService } from './trains/trains.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, EventsController],
  providers: [AppService, EventsService, StationsService, TrainsService],
})
export class AppModule {}
