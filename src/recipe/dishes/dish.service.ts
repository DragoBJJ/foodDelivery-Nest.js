import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreateDishDTO, UpdateDishDTO } from './dto/DishDTO';
import { Dish } from './dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { UserService } from '../../auth/user/user.service';
import slugify from 'slugify';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private dishRepository: Repository<Dish>,
    private readonly userService: UserService,
  ) {}
  async readAll(
    userId: number,
    filters: FilterQueryDto<Dish>,
  ): Promise<{ result: Dish[]; total: number }> {
    const [result, count] = await this.dishRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: { [filters.orderBy]: filters.order },
      join: {
        alias: 'dish',
        leftJoinAndSelect: {
          ingredients: 'dish.ingredients',
          product: 'ingredients.product',
        },
      },
      where: [
        {
          name: Like('%' + filters.query + '%'),
          isPublic: true,
        },
        {
          name: Like('%' + filters.query + '%'),
          userId: userId,
        },
      ],
    });
    return {
      result,
      total: count,
    };
  }
  async getOneByID(userId: number, dishId: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne(dishId, {
      relations: ['user'],
      where: [{ userId }, { isPublic: true }],
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  async getOneOf(userID: number, dishID: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
      id: dishID,
      userId: userID,
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  async createOne(userID: number, dish: CreateDishDTO): Promise<Dish> {
    const user = await this.userService.getOneById(userID);
    const slug = await this.generateSlug(dish.name);
    return this.dishRepository.save({
      ...dish,
      slug,
      user,
    });
  }
  async updateOne(
    userId: number,
    dishId: number,
    @Body() data: UpdateDishDTO,
  ): Promise<Dish> {
    const { id, userId: dishUserId } = await this.getOneByID(userId, dishId);
    if (!id) throw new NotFoundException('Dish not found');
    if (dishUserId !== userId) {
      throw new ForbiddenException('You are not allowed to update this dish');
    }
    await this.dishRepository.save({
      id,
      ...data,
    });
    return this.getOneByID(userId, id);
  }

  async delete(
    userId: number,
    @Param('id') dishID: number,
  ): Promise<DeleteResult> {
    const dish = await this.getOneByID(userId, dishID);
    if (!dish) throw new NotFoundException('Dish not found');
    if (userId !== dish.userId) {
      throw new ForbiddenException('You are not allowed to update this dish');
    }
    return this.dishRepository.delete(dish.id);
  }

  async generateSlug(name: string): Promise<string> {
    let slug = slugify(name, {
      replacement: '-',
      lower: true,
    });

    const isExist = await this.findSlug(slug);

    if (!isExist || isExist.length === 0) return slug;

    slug = `${slug}-${isExist.length}`;
    return slug;
  }

  private async findSlug(slug: string): Promise<Dish[]> {
    return await this.dishRepository
      .createQueryBuilder('dish')
      .where('slug LIKE :slug', { slug: `${slug}%` })
      .getMany();
  }
}
