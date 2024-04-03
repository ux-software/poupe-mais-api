import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategoryInput {
  @IsString({ message: 'Nome da categoria inválido' })
  @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
  categoryName!: string;

  @IsUUID('4', { message: 'Id do usuário inválido' })
  @IsString({ message: 'Id do usuário inválido' })
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId!: string;
}

export class DeleteCategoryInput {
  @IsUUID('4', { message: 'Id do usuário inválido' })
  @IsString({ message: 'Id do usuário inválido' })
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId!: string;

  @IsUUID('4', { message: 'Id da categoria inválido' })
  @IsString({ message: 'Id da categoria inválido' })
  @IsNotEmpty({ message: 'Id da categoria é obrigatório' })
  categoryId!: string;
}
