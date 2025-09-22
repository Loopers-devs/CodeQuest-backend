import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { LikePost } from '../entities/like-post.entity';

export class CreateLikePostDto extends PickType(LikePost, [
  'postId',
  'userId',
] as const) {}

export class LikeListQueryDto {
  @Type(() => Number) @IsInt() @Min(1) page = 1;
  @Type(() => Number) @IsInt() @Min(1) pageSize = 1;
  @IsOptional() @IsInt() userId?: number;
  @IsOptional() @IsUUID() postId?: string;
  @IsOptional() @IsString() search?: string;
}
