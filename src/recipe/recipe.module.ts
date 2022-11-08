import { Module } from '@nestjs/common';
import { DishesController } from './dishes/dishes.controller';
import { ProductsController } from './products/products.controller';
import { DishService } from './dishes/dish.service';
import { ProductService } from './products/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { Dish } from './dishes/dish.entity';
import { IngredientsController } from './ingredients/ingredients.controller';
import { IngredientService } from './ingredients/ingredient.service';
import { Ingredient } from './ingredients/ingredient.entity';
import { IngredientRepository } from './ingredients/ingredient.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Dish, Ingredient, IngredientRepository]),
  ],
  controllers: [DishesController, ProductsController, IngredientsController],
  providers: [ProductService, DishService, IngredientService],
})
export class RecipeModule {}
