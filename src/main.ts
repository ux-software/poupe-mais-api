import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      errorHttpStatusCode: 422,
    }),
  );

  app.enableCors({
    origin: '*',
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
