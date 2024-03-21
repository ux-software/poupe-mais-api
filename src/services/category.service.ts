import { PrismaService } from '@/database/prisma';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';

import { CreateCategoryInput, DeleteCategoryInput } from './dtos';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(input: CreateCategoryInput): Promise<Category> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: input.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const categoryExists = await this.prismaService.category.findFirst({
      where: {
        categoryName: {
          equals: input.categoryName,
          mode: 'insensitive',
        },
      },
    });

    if (categoryExists) {
      throw new ConflictException('Categoria já existe');
    }

    return await this.prismaService.category.create({
      data: {
        categoryName: input.categoryName,
        userId: user.id,
      },
    });
  }

  async list(userId: string): Promise<Category[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.prismaService.category.findMany({
      where: {
        userId,
      },
    });
  }

  async delete(input: DeleteCategoryInput): Promise<void> {
    const [user, category] = await Promise.all([
      this.prismaService.user.findUnique({
        where: {
          id: input.userId,
        },
      }),
      this.prismaService.category.findUnique({
        where: {
          id: input.categoryId,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.prismaService.category.delete({
      where: {
        id: category.id,
        userId: user.id,
      },
    });
  }
}
