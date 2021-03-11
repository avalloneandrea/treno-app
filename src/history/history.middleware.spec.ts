import { HistoryMiddleware } from './history.middleware';

describe('HistoryMiddleware', () => {

  let middleware: HistoryMiddleware;

  beforeEach(() => {
    middleware = new HistoryMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should pass an unseen request', () => {
    const req: any = { body: { event_id: 'id' } };
    const next: any = jest.fn();
    middleware.use(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should stop a seen request', () => {
    const req: any = { body: { event_id: 'id' } };
    const next: any = jest.fn();
    middleware.use(req, null, next);
    middleware.use(req, null, next);
    middleware.use(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

});
