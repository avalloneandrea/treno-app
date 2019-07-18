import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventController } from './controllers/event/event.controller';
import { HistoryMiddleware } from './middlewares/history/history.middleware';
import { StationPipe } from './pipes/station/station.pipe';
import { TrainPipe } from './pipes/train/train.pipe';
import { EventService } from './services/event/event.service';
import { StationService } from './services/station/station.service';
import { TrainService } from './services/train/train.service';

@Module({
  imports: [HttpModule],
  controllers: [EventController],
  providers: [EventService, StationPipe, StationService, TrainPipe, TrainService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HistoryMiddleware).forRoutes(EventController);
  }
}
