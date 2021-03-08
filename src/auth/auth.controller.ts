import { Controller, Get, Query, Redirect } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Get()
  @Redirect()
  handleAuths(@Query('code') code: string) {
    return this.authService.authorize(code);
  }

}
