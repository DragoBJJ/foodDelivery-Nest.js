import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { JwtAuthGuard } from '../../auth/auth/jwt.guard';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get(':id')
  async findOne(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return this.ingredientService.findOne(req.user.id, id);
  }

  @Post()
  async createOne(@Req() req, @Body() ingredient: CreateIngredientDto) {
    return this.ingredientService.create(req.user.id, ingredient);
  }
}
