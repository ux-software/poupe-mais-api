import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getConfig } from '@/config';
import { PrismaService } from '@/database/prisma';
import { UserController } from '@/controllers';
import { AuthGuard } from '@/guards';
import { AuthService, UserService } from '@/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
    }),
    PrismaService,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    UserService,
  ],
})
export class AppModule {}
