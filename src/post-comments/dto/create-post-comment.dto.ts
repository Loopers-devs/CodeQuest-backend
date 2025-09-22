import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Contenido del comentario' })
  @IsString()
  @MinLength(1)
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  content: string;

  @ApiProperty({ example: 'uuid-post', description: 'ID del post' })
  @IsString()
  postId: string;

  @ApiProperty({
    example: 'uuid-parent',
    required: false,
    description: 'Si es respuesta, ID del comentario padre',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class CommentListQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize = 20;

  @ApiPropertyOptional({ example: 'texto a buscar' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;

  @ApiPropertyOptional({
    example: 'uuid-del-comentario-padre',
    description:
      'Si se envía, lista las respuestas de ese comentario; si se omite, lista top-level',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsUUID()
  @ApiProperty({ example: 'uuid-del-post', description: 'ID del post' })
  postId: string;
}
