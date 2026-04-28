import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cacheKey = 'users_all';

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const users = await this.userRepo.find();

    const sanitized = users.map(({ password, ...rest }) => rest);

    await this.cacheManager.set(cacheKey, sanitized, 60);

    return sanitized;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // remove password
    const { password, ...rest } = user;
    return rest;
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    await this.cacheManager.del('users_all');

    const hashedPassword: string = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    try {
      return await this.userRepo.save(user);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('23505')) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    try {
      const updated = await this.userRepo.save(user);
      await this.cacheManager.del('users_all');
      return updated;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.remove(user);

    return { message: 'User deleted successfully' };
  }
}
