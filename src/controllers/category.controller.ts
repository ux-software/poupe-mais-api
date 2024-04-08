import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { validate } from 'class-validator';

import { CategoryService } from '@/services';
import { CreateCategoryInput, DeleteCategoryInput, UpdateCategoryInput } from '@/services/dtos';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Req() request: FastifyRequest, @Body() body: any) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const input = new CreateCategoryInput();
    input.userId = userId;
    input.categoryName = body.categoryName;
    await validate(input);

    const output = await this.categoryService.create(input);

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

    const output = await this.categoryService.list(userId);

    return {
      statusCode: 200,
      body: output,
    };
  }

  @Put(':categoryId')
  async update(
    @Param('categoryId') id: string,
    @Req() request: FastifyRequest, 
    @Body() body: any,
  ) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const input = new UpdateCategoryInput();
    input.userId = userId;
    input.categoryName = body.categoryName;
    await validate(input);

    const output = await this.categoryService.update(id, input);

    return {
      statusCode: 201,
      body: output,
    };
  }

  @Delete(':categoryId')
  async delete(
    @Param('categoryId') id: string,
    @Req() request: FastifyRequest, 
  ) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Não autenticado');
    }

    const input = new DeleteCategoryInput();
    input.userId = userId;
    await validate(input);

    await this.categoryService.delete(id, input);

    return {
      statusCode: 201,
    };
  }
}
