import { Logger } from '@nestjs/common';
import { z } from 'zod';

const envLogger = new Logger('Environment');

export interface Config {
  nodeEnv: 'development' | 'production';
  port: number;
  jwtSecret: string;
  databaseUrl: string;
}

export const getConfig = (): Config => {
  const envSchema = z.object({
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    PORT: z.string().min(1).regex(/^\d+$/).default('3000').transform(Number),
    JWT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  });

  const envResult = envSchema.safeParse(process.env);

  if (!envResult.success) {
    envLogger.error('Invalid environment variables', 'Environment');
    process.exit(1);
  }

  const { data } = envResult;

  return {
    nodeEnv: data.NODE_ENV,
    port: data.PORT,
    jwtSecret: data.JWT_SECRET,
    databaseUrl: data.DATABASE_URL,
  };
};
