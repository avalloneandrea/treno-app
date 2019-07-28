import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HistoryMiddleware implements NestMiddleware {

  private history: string[] = [];

  use(req: any, res: any, next: () => void) {
    const eventId: string = req.body.event_id;
    if (!this.history.includes(eventId)) {
      this.history.push(eventId);
      next();
    }
  }

}
