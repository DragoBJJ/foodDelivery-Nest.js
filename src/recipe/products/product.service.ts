import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductDTO,
  ProductDTO,
  UpdateProductDTO,
} from './dto/ProductDTO';
import { Product } from './Product';
import { DishService } from '../dishes/dish.service';

@Injectable()
export class ProductService {
  async readAll(): Promise<Product[]> {
    return await Product.find();
  }
  async getProductByID(id: number): Promise<Product> {
    const [product] = await Product.findBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // getAlForDishId(dishId: number): Product[] {
  //   const products = this.products.filter(
  //     (product) => product.dishId === dishId,
  //   );
  //   return products;
  // }

  createOne(newProduct: CreateProductDTO): Promise<Product> {
    const product = new Product();
    Object.assign(product, newProduct);
    return product.save();
  }
  async updateOne(product: UpdateProductDTO): Promise<Product> {
    const productToUpdate = await this.getProductByID(product.id);
    Object.assign(productToUpdate, product);
    return productToUpdate;
  }
  async deleteOne(productID: ProductDTO['id']): Promise<Product> {
    const productToRemove = await this.getProductByID(productID);
    return productToRemove.remove();
  }
}
