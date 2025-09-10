import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces';
import { UserEntity } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/mongoose/schemas';
import { Model } from 'mongoose';
import { ProviderType } from 'src/interfaces';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password || null,
      roles: user.role,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password || null,
      roles: user.role,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  async create(
    user: Pick<UserEntity, 'name' | 'email' | 'password'>,
    provider: ProviderType,
  ): Promise<UserEntity> {
    const newUser = new this.userModel({
      name: user.name,
      email: user.email.toLowerCase(),
      password: user.password || null,
      provider: provider,
    });

    const savedUser = await newUser.save();

    return {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      password: savedUser.password || null,
      roles: savedUser.role,
      createdAt: savedUser.createdAt,
      provider: savedUser.provider,
      updatedAt: savedUser.updatedAt,
    };
  }
}
