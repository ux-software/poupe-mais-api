import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { DEFAULT_CATEGORIES } from '@/constants';
import { PrismaService } from '@/database/prisma';
import { AuthService } from './auth.service';
import { SignInInput, SignInOutput, UpdateUserInput } from './dtos';

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

  async findByUsername(username: string): Promise<User[]> {
    const user = await this.prismaService.user.findMany({
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
    const { username, email } = input;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const isValidUsername = usernameRegex.test(username);
    if (!isValidUsername) {
      throw new UnprocessableEntityException('Username inválido');
    }

    const monthlyIncome = 1000;

    const user = await this.prismaService.user.findUnique({
      where: {
        username,
        email,
      },
    });

    const emailExists = await this.prismaService.user.findFirst({
      where: {
        email: email,
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

    if (emailExists) {
      throw new UnprocessableEntityException(
        'Username ou Email já cadastrado!',
      );
    }

    // NOTE: se o usuário não existir, deve-se criar outro e adicionar as categorias padrões
    if (!monthlyIncome) {
      throw new UnprocessableEntityException('Receita mensal é obrigatória');
    }

    const newUser = await this.prismaService.user.create({
      data: {
        username,
        email,
        monthlyIncome,
      },
    });

    await this.prismaService.category.createMany({
      data: DEFAULT_CATEGORIES.map((categoryName) => ({
        categoryName,
        userId: newUser.id,
      })),
      skipDuplicates: false,
    });

    return {
      ...newUser,
      token: this.authService.generateToken({
        id: newUser.id,
        username: newUser.username,
      }),
    };
  }

  async update(input: UpdateUserInput): Promise<User> {
    const { userId, username, email, monthlyIncome } = input;

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (username) {
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      const isValidUsername = usernameRegex.test(username);
      if (!isValidUsername) {
        throw new UnprocessableEntityException('Username inválido');
      }

      user.username = username;
    }    

    if (email) {
      const emailExists = await this.prismaService.user.findFirst({
        where: {
          email: email,
        },
      });

      if (emailExists) {
        throw new UnprocessableEntityException(
          'Username ou Email já cadastrado!',
        );
      }

      user.email = email;
    }

    if (monthlyIncome) {
      user.monthlyIncome = monthlyIncome;
    }

    user.updatedAt = new Date();

    return await this.prismaService.user.update({
      where: { id: user.id },
      data: user,
    });
  }
}
