import { HistoryMiddleware } from './history.middleware';

describe('HistoryMiddleware', () => {

  let middleware: HistoryMiddleware;

  beforeEach(() => {
    middleware = new HistoryMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should pass unseen requests only', () => {
    const req = { body: { event_id: '3V3NT1D' } } as any;
    const next = jest.fn() as any;
    middleware.use(req, null, next);
    middleware.use(req, null, next);
    middleware.use(req, null, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

});
