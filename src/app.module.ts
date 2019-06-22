import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { StationsService } from './stations/stations.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, EventsController],
  providers: [AppService, StationsService],
})
export class AppModule {}
