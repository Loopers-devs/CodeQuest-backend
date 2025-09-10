import { ProviderType } from 'src/interfaces';
import { UserEntity } from 'src/users/entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(
    user: Pick<UserEntity, 'nickname' | 'fullName' | 'email' | 'password'>,
    provider?: ProviderType,
  ): Promise<UserEntity>;
}
