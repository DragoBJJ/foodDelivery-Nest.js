import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateDishDTO, UpdateDishDTO } from './dto/DishDTO';
import { Dish } from './dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
  ) {}
  async readAll(): Promise<Dish[]> {
    return this.dishRepository.find({ relations: ['products'] });
  }
  async getOneByID(dishId: number): Promise<Dish> {
    const [dish] = await this.dishRepository.find({
      where: { id: dishId },
      relations: ['products'],
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  createOne(@Body() dish: CreateDishDTO): Promise<Dish> {
    return this.dishRepository.save(dish);
  }
  async updateOne(@Body() dish: UpdateDishDTO): Promise<UpdateResult> {
    await this.getOneByID(dish.id);
    return this.dishRepository.update(dish.id, dish);
  }

  async delete(@Param('id') dishID: number): Promise<Dish> {
    const dish = await this.getOneByID(dishID);
    return this.dishRepository.remove(dish);
  }
}
