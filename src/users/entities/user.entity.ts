import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProviderType, RoleType, UserProvider } from 'src/interfaces';

export class UserEntity {
  id: number;

  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(3)
  fullName: string;
  nickname: string | null;

  roles: Array<RoleType>;

  @IsOptional()
  @IsUrl()
  image: string | null;

  @IsOptional()
  @IsDate()
  emailVerified: Date | null;
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;

  passwordResetToken: string | null;
  passwordResetTokenExpiry: Date | null;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string | null;

  @IsEnum(UserProvider)
  provider: ProviderType;
  providerAccountId: string | null;

  createdAt: Date;
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}
