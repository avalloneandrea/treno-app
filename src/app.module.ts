import { HttpModule } from '@nestjs/axios';
import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { HistoryMiddleware } from './history/history.middleware';
import { StatusPipe } from './status/status.pipe';
import { StatusService } from './status/status.service';

@Module({
  imports: [
    CacheModule.register({ store: redisStore, url: process.env.REDIS_URL }),
    HttpModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
  ],
  controllers: [
    AuthController,
    EventController,
  ],
  providers: [
    AuthService,
    EventService,
    StatusPipe,
    StatusService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HistoryMiddleware).forRoutes(EventController);
  }
}
