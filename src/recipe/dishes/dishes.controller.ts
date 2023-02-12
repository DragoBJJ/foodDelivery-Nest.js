import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDishDTO, UpdateDishDTO } from './dto/DishDTO';
import { DishService } from './dish.service';
import { JwtAuthGuard } from '../../auth/auth/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Dish } from './dish.entity';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { FilterBy } from '../../common/decorators/filter-by.decorator';

@Controller('dishes')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class DishesController {
  private dishService: DishService;
  constructor(dishService: DishService) {
    this.dishService = dishService;
  }

  @Get()
  readAll(@Req() req, @FilterBy<Dish>() filters: FilterQueryDto<Dish>) {
    return this.dishService.readAll(req.user.id, filters);
  }

  @Get(':id')
  readOne(@Req() req, @Param('id', ParseIntPipe) dishId: number) {
    return this.dishService.getOneByID(req.user.id, dishId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Req() req, @Body() dish: CreateDishDTO) {
    return this.dishService.createOne(req.user.id, dish);
  }

  @Patch(':id')
  updateOne(
    @Req() req,
    @Param('id', ParseIntPipe) dishId,
    @Body() dish: UpdateDishDTO,
  ) {
    return this.dishService.updateOne(req.user.id, dishId, dish);
  }

  @Delete()
  deleteOne(@Req() req, @Param('id') dishID: number) {
    return this.dishService.delete(req.user.id, dishID);
  }
}
