import { CacheModule, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ChatController } from './chat/chat.controller';
import { ChatPipe } from './chat/chat.pipe';
import { ChatService } from './chat/chat.service';
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
    ChatController,
  ],
  providers: [
    AuthService,
    ChatPipe, ChatService,
    StatusPipe, StatusService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HistoryMiddleware).forRoutes(ChatController);
  }
}
