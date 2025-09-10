import { ProviderType } from 'src/interfaces';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(
    user: Pick<UserEntity, 'name' | 'email' | 'password'>,
    provider?: ProviderType,
  ): Promise<UserEntity>;
}
