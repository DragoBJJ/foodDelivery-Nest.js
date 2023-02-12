import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/auth/jwt.guard';
import { FilterBy } from '../../common/decorators/filter-by.decorator';
import { Product } from './product.entity';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';

@Controller('products')
export class ProductsController {
  private productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Get()
  readAll(@FilterBy<Product>() filters: FilterQueryDto<Product>) {
    return this.productService.readAll(filters);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Body() product: CreateProductDto) {
    // this.productService.dishService.getOneByID(product.dishId);
    return this.productService.createOne(product);
  }

  @Put()
  updateOne(@Body() product: UpdateProductDto) {
    return this.productService.updateOne(product);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) productID: number) {
    return this.productService.deleteOne(productID);
  }
}
