import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class PostCommentEntity {
  @IsUUID()
  id: string;

  @IsString()
  postId: string;

  @IsInt()
  authorId: number;

  @ApiProperty({ example: 'Texto del comentario' })
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date | null;
}
