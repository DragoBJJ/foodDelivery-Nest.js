import { Product } from '../products/Product';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Dish extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'decimal' })
  servings: number;
  @Column({ nullable: true, type: 'text' })
  description?: string;

  products: Product[];
}
