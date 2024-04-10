import { User } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateUserInput {
  @IsString({ message: 'Username inválido' })
  @IsNotEmpty({ message: 'Username é obrigatório' })
  username!: string;

  @IsNumber({}, { message: 'Receita mensal inválida' })
  @IsNotEmpty({ message: 'Receita mensal é obrigatória' })
  monthlyIncome!: number;
}

export class UpdateUserInput {
  @IsUUID('4', { message: 'Id do usuário inválido' })
  @IsString({ message: 'Id do usuário inválido' })
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId!: string;

  @IsString({ message: 'Username inválido' })
  username?: string;

  @IsString({ message: 'Email inválido' })
  email?: string;

  @IsNumber({}, { message: 'Receita mensal inválida' })
  monthlyIncome?: number;
}

export class SignInInput {
  @IsString({ message: 'Username inválido' })
  @IsNotEmpty({ message: 'Username é obrigatório' })
  username!: string;

  @IsString({ message: 'Username inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email!: string;
}

export type SignInOutput = User & {
  token: string;
};
