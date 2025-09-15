import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class SocialLoginDto extends PickType(UserEntity, [
  'email',
  'fullName',
  'nickname',
  'image',
  'provider',
] as const) {
  @IsString()
  userId: string;
}
