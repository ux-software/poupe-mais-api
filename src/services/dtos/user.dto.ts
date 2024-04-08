import { User } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserInput {
  @IsString({ message: 'Username inválido' })
  @IsNotEmpty({ message: 'Username é obrigatório' })
  username!: string;

  @IsNumber({}, { message: 'Receita mensal inválida' })
  @IsNotEmpty({ message: 'Receita mensal é obrigatória' })
  monthlyIncome!: number;
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
