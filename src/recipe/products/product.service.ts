import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductDTO,
  ProductDTO,
  UpdateProductDTO,
} from './dto/ProductDTO';
import { Product } from './product.entity';
import { DishService } from '../dishes/dish.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async readAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }
  async getProductByID(id: number): Promise<Product> {
    const [product] = await this.productRepository.find({
      where: { id },
      relations: ['products'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // getAlForDishId(dishId: number): Product[] {
  //   const products = this.products.filter(
  //     (product) => product.dishId === dishId,
  //   );
  //   return products;
  // }

  async createOne(product: CreateProductDTO): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }
  async updateOne(product: UpdateProductDTO): Promise<UpdateResult> {
    const productToUpdate = await this.getProductByID(product.id);
    return this.productRepository.update(product.id, productToUpdate);
  }
  async deleteOne(productID: ProductDTO['id']): Promise<Product> {
    const productToRemove = await this.getProductByID(productID);
    return this.productRepository.remove(productToRemove);
  }
}
