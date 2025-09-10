import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Provider, ProviderType } from 'src/interfaces';
import { IUserRepository } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    provider?: ProviderType,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('Usuario ya registrado');
    }

    const providerType = provider || Provider.LOCAL;

    const newUser = await this.userRepository.create(
      {
        ...createUserDto,
        password: createUserDto.password
          ? await bcryptjs.hash(createUserDto.password, 10)
          : null,
      },
      providerType,
    );

    return newUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async profile(email?: string): Promise<UserEntity> {
    if (!email) {
      throw new BadRequestException('Email no proporcionado');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    user.password = null;

    return user;
  }
}
