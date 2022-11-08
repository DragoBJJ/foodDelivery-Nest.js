import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { User } from '../../../user/user.entity';

define(User, (faker: Faker) => {
  const user = new User();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  user.username = `${firstName} ${lastName}`;
  return user;
});