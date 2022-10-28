import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateDishDTO, UpdateDishDTO } from './dto/DishDTO';
import { Dish } from './DishType';

@Injectable()
export class DishService {
  readAll(): Promise<Dish[]> {
    return Dish.find();
  }

  async getOneByID(dishID: number): Promise<Dish> {
    const [dish] = await Dish.findBy({
      id: dishID,
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  createOne(@Body() dish: CreateDishDTO): Promise<Dish> {
    const newDish = new Dish();
    Object.assign(newDish, dish);
    return newDish.save();
  }
  async updateOne(@Body() dish: UpdateDishDTO): Promise<Dish> {
    const dishToUpdate = await this.getOneByID(dish.id);
    Object.assign(dishToUpdate, dish);
    return dishToUpdate.save();
  }

  async delete(@Param('id') dishID: number): Promise<Dish> {
    const dish = await this.getOneByID(dishID);
    return dish.remove();
  }
}
