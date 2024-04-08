import { PrismaService } from '@/database/prisma';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';

import { CreateTransactionInput, DeleteTransactionInput } from './dtos';

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

    if (input.type === 'INCOME' && input.categoryId) {
      throw new BadRequestException('Ganho não precisa de uma categoria');
    }
    if (input.type === 'EXPENSE' && !input.categoryId) {
      throw new BadRequestException('Despesa precisa de uma categoria');
    }

    return await this.prismaService.transaction.create({
      data: {
        value: input.value,
        description: input.description,
        type: input.type,
        userId: user.id,
        categoryId: input.categoryId,
      },
    });
  }

  async list(userId: string): Promise<Transaction[]> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.prismaService.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async delete(input: DeleteTransactionInput): Promise<void> {
    const [user, transaction] = await Promise.all([
      this.prismaService.user.findUnique({
        where: {
          id: input.userId,
        },
      }),
      this.prismaService.transaction.findUnique({
        where: {
          id: input.transactionId,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    await this.prismaService.transaction.delete({
      where: {
        id: transaction.id,
        userId: user.id,
      },
    });
  }
}
