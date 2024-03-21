import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryInput {
  @IsString({ message: 'Nome da categoria inválido' })
  @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
  categoryName!: string;

  @IsString({ message: 'Id do usuário inválido' })
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId!: string;
}

export class DeleteCategoryInput {
  @IsString({ message: 'Id do usuário inválido' })
  @IsNotEmpty({ message: 'Id do usuário é obrigatório' })
  userId!: string;

  @IsString({ message: 'Id da categoria inválido' })
  @IsNotEmpty({ message: 'Id da categoria é obrigatório' })
  categoryId!: string;
}
