import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientRepository } from './ingredient.repository';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { DishService } from '../dishes/dish.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class IngredientService {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly productService: ProductService,
    private readonly dishService: DishService,
  ) {}

  async findOne(userId: number, id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne(id, {
      relations: ['dish', 'product'],
    });
    if (
      !ingredient ||
      (ingredient.dish.userId !== userId && !ingredient.dish.isPublic)
    ) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }
    return ingredient;
  }

  async create(
    userID: number,
    ingredient: CreateIngredientDto,
  ): Promise<Ingredient> {
    const dish = await this.dishService.getOneOf(userID, ingredient.dishId);
    const product = await this.productService.getProductByID(
      ingredient.productId,
    );
    return this.ingredientRepository.save({
      ...ingredient,
      dish,
      product,
    });
  }
}
