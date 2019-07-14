import { HistoryMiddleware } from './history.middleware';

describe('HistoryMiddleware', () => {

  let historyMiddleware: HistoryMiddleware;

  beforeEach(() => {
    historyMiddleware = new HistoryMiddleware();
  });

  it('should be defined', () => {
    expect(historyMiddleware).toBeDefined();
  });

  it('should pass an unseen request', () => {
    const req: any = {body: {event_id: 'event_id'}};
    const next: any = jest.fn();
    historyMiddleware.use(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should stop a seen request', () => {
    const req: any = {body: {event_id: 'event_id'}};
    const next: any = jest.fn();
    historyMiddleware.use(req, null, next);
    historyMiddleware.use(req, null, next);
    historyMiddleware.use(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

});
