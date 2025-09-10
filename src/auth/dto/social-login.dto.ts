import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ProviderType, UserProvider } from 'src/interfaces';

export class SocialLoginDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  nickname: string | null;

  @IsOptional()
  @IsString()
  picture: string | null;

  @IsEnum(UserProvider)
  provider: ProviderType;
}
