import { Controller, Get, Query, Redirect } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private service: AuthService) {}

  @Get()
  @Redirect()
  handleAuths(@Query('code') code: string) {
    return this.service.authorize(code);
  }

}
