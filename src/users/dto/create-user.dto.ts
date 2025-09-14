import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateUserDto extends PickType(UserEntity, [
  'fullName',
  'email',
  'password',
] as const) {}
