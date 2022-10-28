import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateDishDTO, UpdateDishDTO } from './dto/DishDTO';
import { DishService } from './dish.service';

@Controller('dishes')
export class DishesController {
  private dishService: DishService;
  constructor(dishService: DishService) {
    this.dishService = dishService;
  }

  @Get()
  readAll() {
    return this.dishService.readAll();
  }

  @Get(':id')
  readOne(@Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.getOneByID(dishId);
  }

  @Post()
  createOne(@Body() dish: CreateDishDTO) {
    return this.dishService.createOne(dish);
  }

  @Put()
  updateOne(@Body() dish: UpdateDishDTO) {
    return this.dishService.updateOne(dish);
  }

  @Delete()
  deleteOne(@Param('id') dishID: number) {
    return this.dishService.delete(dishID);
  }
}
