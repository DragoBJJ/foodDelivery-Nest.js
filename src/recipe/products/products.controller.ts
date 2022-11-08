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

import { CreateProductDTO, UpdateProductDTO } from './dto/ProductDTO';
import { ProductService } from './product.service';

@Controller('products')
export class ProductsController {
  private productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Get()
  readAll() {
    return this.productService.readAll();
  }

  @Post()
  createOne(@Body() product: CreateProductDTO) {
    // this.productService.dishService.getOneByID(product.dishId);
    return this.productService.createOne(product);
  }

  @Put()
  updateOne(@Body() product: UpdateProductDTO) {
    return this.productService.updateOne(product);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) productID: number) {
    return this.productService.deleteOne(productID);
  }
}
