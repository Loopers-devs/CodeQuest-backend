import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PostStatus, PostVisibility } from 'src/interfaces';
import { toSlug } from 'src/utils';
import { ApiProperty } from '@nestjs/swagger';

export class PostEntity {
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Conociendo React', type: String })
  @IsString()
  @MinLength(5)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title: string;

  @ApiProperty({ example: 'conociendo-react', type: String })
  @IsString()
  @MinLength(5)
  @Transform(({ value }: { value: string }) => toSlug(value))
  slug: string;

  @ApiProperty({
    example: 'Este es un post sobre React.',
    type: String,
    description: 'Resumen del post',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  summary: string | null;

  @ApiProperty({
    example: 'En este post exploramos cómo funciona React...',
    type: String,
    description: 'Contenido del post',
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({ enum: PostStatus, description: 'Estado del post' })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({ enum: PostVisibility, description: 'Visibilidad del post' })
  @IsEnum(PostVisibility)
  visibility: PostVisibility;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    type: String,
    description: 'URL de la imagen de portada',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImageUrl: string | null;

  @ApiProperty({
    example: '2023-06-15T12:00:00Z',
    type: Date,
    description: 'Fecha de publicación del post',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt: Date | null;

  @ApiProperty({
    example: 123,
    type: Number,
    description: 'Número de vistas del post',
  })
  @IsInt()
  @Min(0)
  views: number;

  @ApiProperty({
    example: 12,
    type: Number,
    description: 'Número de comentarios',
  })
  @IsInt()
  @Min(0)
  commentsCount: number;

  @ApiProperty({
    example: 5,
    type: Number,
    description: 'Número de reacciones',
  })
  @IsInt()
  @Min(0)
  reactionsCount: number;

  // Auditoría
  @ApiProperty({
    example: '2023-06-15T12:00:00Z',
    type: Date,
    description: 'Fecha de creación',
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2023-06-16T12:00:00Z',
    type: Date,
    description: 'Fecha de actualización',
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    example: '2023-06-17T12:00:00Z',
    type: Date,
    description: 'Fecha de eliminación (si está borrado)',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt: Date | null;

  @ApiProperty({ example: 1, type: Number, description: 'ID del autor' })
  @IsInt()
  authorId: number;

  @IsUUID()
  categoryId: string;

  @IsArray()
  tags: string[]; // ["#javascript", "#nestjs"]

  category: string | null; // "Tecnología"
}
