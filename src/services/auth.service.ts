import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';

import { Config } from '@/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config>,
  ) {}

  generateToken({ id, username }: { id: string; username: string }): string {
    const jwtSecret = this.configService.get<string>('jwtSecret');
    if (!jwtSecret) {
      throw new InternalServerErrorException();
    }

    return this.jwtService.sign(
      { id, username },
      {
        secret: jwtSecret,
        expiresIn: '7d',
      },
    );
  }

  decodeToken(token: string): {
    id: string;
    username: string;
  } {
    try {
      const secret = this.configService.get<string>('jwtSecret');
      if (!secret) {
        throw new InternalServerErrorException();
      }

      this.jwtService.verify(token, { secret });
    } catch (error: unknown) {
      if (error instanceof NotBeforeError) {
        throw new UnauthorizedException('Token não ativo');
      }

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expirado');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token inválido');
      }

      throw new UnauthorizedException('Não autorizado');
    }

    return this.jwtService.decode<{
      id: string;
      username: string;
    }>(token);
  }

  verifyToken(value: string): boolean {
    const secret = this.configService.get<string>('jwtSecret');
    if (!secret) {
      throw new InternalServerErrorException();
    }

    try {
      this.jwtService.verify(value, { secret });
    } catch (error: unknown) {
      return false;
    }

    return true;
  }
}
