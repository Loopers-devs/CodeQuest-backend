import { OmitType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';
import { IsArray, IsDate, IsEnum, IsInt, IsOptional, IsString, IsUrl, IsUUID, Min } from 'class-validator';
import { PostStatus, PostVisibility } from 'src/interfaces';

export class CreatePostDto extends OmitType(PostEntity, ['tags', 'id', 'views', 'commentsCount', 'reactionsCount', 'createdAt', 'updatedAt','authorId']) {
  @IsString()
  @IsOptional()  // Este campo es opcional
  title: string;

  @IsString()
  @IsOptional()  // Este campo es opcional
  slug: string;

  @IsString()
  @IsOptional()  // Este campo es opcional
  summary: string | null;

  @IsString()
  content: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsEnum(PostVisibility)
  visibility: PostVisibility;

  @IsUrl()
  @IsOptional()  // Este campo es opcional
  coverImageUrl: string | null;

  @IsDate()
  @IsOptional()  // Este campo es opcional
  publishedAt: Date | null;

  @IsInt()
  @Min(0)
  @IsOptional()  // Este campo es opcional
  views: number;

  @IsInt()
  @Min(0)
  @IsOptional()  // Este campo es opcional
  commentsCount: number;

  @IsInt()
  @Min(0)
  @IsOptional()  // Este campo es opcional
  reactionsCount: number;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];  
}
