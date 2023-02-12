import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Ingredient } from '../ingredients/ingredient.entity';

export type UintType =
  | 'kg'
  | 'g'
  | 'tsp'
  | 'sp'
  | 'pinch'
  | 'ml'
  | 'l'
  | 'item';
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  unit: UintType;

  @OneToMany(() => Ingredient, (ingredient: Ingredient) => ingredient.product, {
    onDelete: 'CASCADE',
  })
  ingredients: Ingredient[];

  @Column({ type: 'varchar' })
  createdAt: string;
}
