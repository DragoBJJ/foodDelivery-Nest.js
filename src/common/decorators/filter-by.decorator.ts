import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseEntity } from 'typeorm';
import { FilterQueryDto } from '../dto/filter-query.dto';
import { Dish } from '../../recipe/dishes/dish.entity';

export const FilterBy = createParamDecorator(
  <Entity extends BaseEntity>(
    data: FilterQueryDto<Entity>,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const {
      query = data.query ?? '',
      offset = data.offset ?? 0,
      limit = data.limit ?? 10,
      order = data.order ?? 'DESC',
      orderBy = data.orderBy ?? 'createdAt',
    } = request.query;
    return new FilterQueryDto(query, offset, limit, order, orderBy);
  },
);
