import { IsEmail, IsString } from 'class-validator';

export class LoginGoogleDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;

  @IsString()
  provider: string;
}
