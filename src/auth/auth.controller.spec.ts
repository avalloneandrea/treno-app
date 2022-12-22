import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {

  let controller: AuthController;
  let service: DeepMocked<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ AuthController ],
    }).useMocker(createMock).compile();
    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle authorizations', () => {
    const code = 'code';
    controller.handleAuthorizations(code);
    expect(service.handleAuthorizations).toHaveBeenCalledWith(code);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});
