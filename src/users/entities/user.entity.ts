import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Provider, ProviderType, RoleType } from 'src/interfaces';

export class UserEntity {
  id: string;

  roles: RoleType[];

  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string | null;

  @IsEnum(Provider)
  provider: ProviderType;

  createdAt: Date;
  updatedAt: Date;
}
