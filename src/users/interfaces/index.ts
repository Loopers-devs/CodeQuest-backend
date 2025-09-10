import { ProviderType } from 'src/interfaces';
import { UserEntity } from 'src/users/entities/user.entity';
import { Prisma } from '@prisma/client';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(
    user: Pick<UserEntity, 'nickname' | 'fullName' | 'email' | 'password'>,
    provider?: ProviderType,
  ): Promise<UserEntity>;
}


export type DbUser = Prisma.UserGetPayload<{}>
