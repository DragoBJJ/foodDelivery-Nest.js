import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(payload) {
    return await this.userRepository.findOne(payload);
  }

  async create(user: Pick<CreateUserDto, 'email' | 'password'>): Promise<User> {
    return this.userRepository.save({
      email: user.email.trim().toLowerCase(),
      password: this.hasPassword(user.password),
    });
  }
  async update(id, props: Partial<UpdateUserDto>) {
    const user = await this.userRepository.preload({
      id,
      ...props,
    });

    if (!user) throw new NotFoundException(`User with id ${id} does not exist`);
    return this.userRepository.save(user);
  }
  hasPassword(userPassword: string): string {
    return bcrypt.hashSync(userPassword, 8);
  }
}
