import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getConfig } from '@/config';
import { CategoryController, UserController } from '@/controllers';
import { PrismaService } from '@/database/prisma';
import {
  AuthService,
  CategoryService,
  TransactionService,
  UserService,
} from '@/services';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TransactionController } from './controllers/transaction.controller';
import { AuthGuard } from './guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
    }),
  ],
  controllers: [UserController, TransactionController, CategoryController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtService,
    AuthService,
    CategoryService,
    TransactionService,
    UserService,
    PrismaService,
  ],
})
export class AppModule {}
