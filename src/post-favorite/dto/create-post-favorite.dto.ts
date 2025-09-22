import { PickType } from '@nestjs/swagger';
import { PostFavorite } from '../entities/post-favorite.entity';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePostFavoriteDto extends PickType(PostFavorite, [
  'postId',
  'userId',
] as const) {}

export class PostFavoriteListQueryDto {
  @Type(() => Number) @IsInt() @Min(1) page = 1;
  @Type(() => Number) @IsInt() @Min(1) pageSize = 1;
  @IsOptional() @IsInt() userId?: number;
  @IsOptional() @IsUUID() postId?: string;
  @IsOptional() @IsString() search?: string;
}
