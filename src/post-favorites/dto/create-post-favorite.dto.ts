import { PickType } from '@nestjs/swagger';
import { PostFavorite } from '../entities/post-favorite.entity';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostFavoriteDto extends PickType(PostFavorite, [
  'postId',
] as const) {}

export class PostIsFavoriteDto extends PickType(PostFavorite, [
  'postId',
  'userId',
] as const) {}

export class FindManyPostFavoritesDto {
  @IsOptional()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsUUID()
  cursor: string | null;

  @IsOptional()
  @IsArray()
  relations?: string[];
}
