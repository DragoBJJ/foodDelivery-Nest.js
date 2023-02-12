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

  async getOneById(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.dishes', 'dishes')
      .select(['user.id', 'user.email', 'dishes.name', 'dishes.id'])
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(user: Pick<CreateUserDto, 'email' | 'password'>): Promise<User> {
    return this.userRepository.save({
      email: user.email.trim().toLowerCase(),
      password: this.hasPassword(user.password),
    });
  }
  async update(user: Partial<UpdateUserDto>) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with id ${user.id} does not exist`);
    }
    return this.userRepository.save({
      ...userToUpdate,
      user,
    });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    const { affected } = await this.userRepository.delete(user.id);
    return { success: !!affected };
  }
  hasPassword(userPassword: string): string {
    return bcrypt.hashSync(userPassword, 8);
  }
}
