import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '@/decorators';
import { UserService } from '@/services';
import { SignInInput } from '@/services/dtos';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() input: SignInInput) {
    const output = await this.userService.signIn(input);

    return {
      statusCode: 200,
      body: output,
    };
  }
}
