import { HttpService } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpServiceMock } from "../../test/http.service.mock";

describe('AuthController', () => {

  let controller: AuthController;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController, AuthService,
        { provide: HttpService, useClass: HttpServiceMock }
      ]
    }).compile();
    controller = fixture.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle authorizations', () => {
    controller.handleAuthorizations('code')
      .subscribe(result => expect(result).toEqual({ url: 'www.redirect.url' }));
  });

});
