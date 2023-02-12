import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDishDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  servings: number;

  @IsOptional()
  @IsString()
  description: string;
}

export class CreateDishDTO extends UpdateDishDTO {
  @IsString()
  name;
}
