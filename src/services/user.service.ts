import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/database/prisma';
import { SignInInput, SignInOutput } from './dtos';
import { AuthService } from './auth.service';
import { DEFAULT_CATEGORIES } from '@/constants';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async signIn(input: SignInInput): Promise<SignInOutput> {
    const { username, monthlyIncome } = input;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const isValidUsername = usernameRegex.test(username);
    if (!isValidUsername) {
      throw new UnprocessableEntityException('Username inválido');
    }

    if (monthlyIncome) {
      const isValidMonthlyIncome = monthlyIncome >= 0;
      if (!isValidMonthlyIncome) {
        throw new UnprocessableEntityException('Receita mensal inválida');
      }
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return {
        ...user,
        token: this.authService.generateToken({
          id: user.id,
          username: user.username,
        }),
      };
    }

    // NOTE: se o usuário não existir, deve-se criar outro e adicionar as categorias padrões
    if (!monthlyIncome) {
      throw new UnprocessableEntityException('Receita mensal é obrigatória');
    }

    const newUser = await this.prismaService.user.create({
      data: {
        username,
        monthlyIncome,
      },
    });

    await this.prismaService.category.createMany({
      data: DEFAULT_CATEGORIES.map((categoryName) => ({
        categoryName,
        userId: newUser.id,
      })),
      skipDuplicates: true,
    });

    return {
      ...newUser,
      token: this.authService.generateToken({
        id: newUser.id,
        username: newUser.username,
      }),
    };
  }
}
