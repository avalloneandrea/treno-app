import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { HistoryMiddleware } from './history/history.middleware';
import { StationPipe } from './station/station.pipe';
import { StationService } from './station/station.service';
import { TrainPipe } from './train/train.pipe';
import { TrainService } from './train/train.service';

@Module({
  imports: [ HttpModule ],
  controllers: [
    AuthController,
    EventController
  ],
  providers: [
    AuthService,
    EventService,
    StationPipe,
    StationService,
    TrainPipe,
    TrainService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HistoryMiddleware).forRoutes(EventController);
  }
}
