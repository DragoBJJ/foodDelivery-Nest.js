import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async readAll(
    filters: FilterQueryDto<Product>,
  ): Promise<{ result: Product[]; total: number }> {
    const [result, total] = await this.productRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: { [filters.orderBy]: filters.order },
      where: [{ name: Like('%' + filters.query + '%') }],
    });
    return {
      result,
      total,
    };
  }
  async getProductByID(id: number): Promise<Product> {
    const [product] = await this.productRepository.find({
      where: { id },
      relations: ['products'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
  async createOne(product: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }
  async updateOne(product: UpdateProductDto): Promise<UpdateResult> {
    const productToUpdate = await this.getProductByID(product.id);
    return this.productRepository.update(product.id, productToUpdate);
  }
  async deleteOne(productID: number): Promise<Product> {
    const productToRemove = await this.getProductByID(productID);
    return this.productRepository.remove(productToRemove);
  }
}
