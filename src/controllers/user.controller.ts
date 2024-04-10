import { Body, Controller, Param, Post, Put, Req, UnauthorizedException } from '@nestjs/common';

import { Public } from '@/decorators';
import { UserService } from '@/services';
import { SignInInput, UpdateUserInput } from '@/services/dtos';
import { FastifyRequest } from 'fastify';
import { validate } from 'class-validator';

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

  @Put()
  async update(
    @Req() request: FastifyRequest, 
    @Body() body: any,
  ) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const input = new UpdateUserInput();
    input.userId = userId;
    input.username = body.username;
    input.email = body.email;
    input.monthlyIncome = body.monthlyIncome;
    await validate(input);

    const output = await this.userService.update(input);

    return {
      statusCode: 201,
      body: output,
    };
  }
}
