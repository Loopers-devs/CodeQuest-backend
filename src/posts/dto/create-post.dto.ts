import { OmitType, PickType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';
import { IsArray, IsString } from 'class-validator';

export class CreatePostDto extends OmitType(PostEntity, ['tags']) {
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  authorId: number;
}
