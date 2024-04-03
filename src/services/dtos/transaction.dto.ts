import { IsIn, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateIf } from "class-validator";

export const TRANSACTION_TYPE = [
  'EXPENSE',
  'INCOME',
] as const;

export class CreateTransactionInput {
  @IsNumber({ message: 'Valor da transação inválido' })
  @IsNotEmpty({ message: 'Valor da transação é obrigatório' })
  value!: number;

  @IsString({ message: 'Descrição da transação inválida' })
  @ValidateIf((_, value) => value !== undefined)
  description?: string;

  @IsIn(TRANSACTION_TYPE, { message: 'Tipo da transação deve ser "EXPENSE" ou "INCOME"' })
  type!: typeof TRANSACTION_TYPE[number];

  @IsUUID('4', { message: 'Id do usuário inválido' })
  @IsString({ message: 'Id do usuário inválido' })
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId!: string;
}
