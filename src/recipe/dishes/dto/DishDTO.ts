import { IsNumber, IsString, IsOptional } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class DishDTO {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsNumber()
  servings: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDishDTO {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsNumber()
  servings: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateDishDTO extends OmitType(UpdateDishDTO, ['id'] as const) {}
