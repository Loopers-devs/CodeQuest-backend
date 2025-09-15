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
import { type ProviderType, RoleType, UserProvider } from 'src/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  id: number;

  @ApiProperty({ example: 'user@example.com', type: String })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({ example: 'johnny', type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  nickname: string | null;

  roles: Array<RoleType>;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  image: string | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  emailVerified: Date | null;
  emailVerificationToken: string | null;
  emailVerificationExpiry: Date | null;

  passwordResetToken: string | null;
  passwordResetTokenExpiry: Date | null;

  @ApiProperty({ example: 'strongPassword123', type: String })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string | null;

  @IsEnum(UserProvider)
  provider: ProviderType;
  providerAccountId: string | null;

  createdAt: Date;
  updatedAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}
