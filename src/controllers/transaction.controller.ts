import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { FastifyRequest } from 'fastify';

import { TransactionService } from '@/services';
import { CreateTransactionBody, CreateTransactionInput } from '@/services/dtos';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async create(
    @Req() request: FastifyRequest,
    @Body() body: CreateTransactionBody,
  ) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const input = new CreateTransactionInput();
    input.userId = userId;
    input.description = body.description;
    input.type = body.type;
    input.value = body.value;
    input.categoryId = body.categoryId;
    await validate(input);

    const output = await this.transactionService.create(input);

    return {
      statusCode: 201,
      body: output,
    };
  }

  @Get('list')
  async list(@Req() request: FastifyRequest) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const output = await this.transactionService.list(userId);

    return {
      statusCode: 200,
      body: output,
    };
  }

  @Delete(':id')
  async delete(@Req() request: FastifyRequest) {
    const userId = request.user?.id;
    const { id } = request.params as { id: string };

    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const output = await this.transactionService.delete({
      userId: userId,
      transactionId: id,
    });

    return {
      statusCode: 200,
      body: output,
    };
  }
}
