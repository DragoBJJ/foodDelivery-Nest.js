import { IsNumber, IsString, IsEnum } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class ProductDTO {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  unit: 'kg' | 'g' | 'tsp' | 'sp' | 'pinch' | 'ml' | 'l' | 'item';

  @IsNumber()
  amount: number;

  @IsNumber()
  dishId: number;
}

export class UpdateProductDTO {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
  @IsString()
  unit: 'kg' | 'g' | 'tsp' | 'sp' | 'pinch' | 'ml' | 'l' | 'item';

  @IsNumber()
  amount: number;

  @IsNumber()
  dishId: number;
}

export class CreateProductDTO extends OmitType(UpdateProductDTO, [
  'id',
] as const) {}
