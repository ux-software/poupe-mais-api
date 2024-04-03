import { PrismaService } from '@/database/prisma';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';

import { CreateTransactionInput } from './dtos';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  async create(input: CreateTransactionInput): Promise<Transaction> {
    if (!(input.value > 0)) {
      throw new BadRequestException('Valor deve ser maior que 0');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: input.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.prismaService.transaction.create({
      data: {
        value: input.value,
        description: input.description,
        type: input.type,
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
