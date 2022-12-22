import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HistoryMiddleware implements NestMiddleware {

  private history: string[] = [];

  use(req: Request, res: Response, next: NextFunction) {
    const eventId = req.body.event_id;
    if (!this.history.includes(eventId)) {
      this.history.push(eventId);
      next();
    }
  }

}
