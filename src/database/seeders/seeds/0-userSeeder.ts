import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../../auth/user/user.entity';
import { initializeSeeds } from '../initializeSeeds';
initializeSeeds();

export default class userSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(User)().createMany(15);
  }
}
