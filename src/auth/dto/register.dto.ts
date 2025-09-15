import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class RegisterDto extends PickType(UserEntity, [
  'email',
  'fullName',
  'nickname',
  'password',
] as const) {}
