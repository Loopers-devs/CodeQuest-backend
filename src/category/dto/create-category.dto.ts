import { PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto extends PickType(Category, [
  'name',
  'description',
] as const) {}

export class CategoryListQueryDto {
  @Type(() => Number) @IsInt() @Min(1) page = 1;
  @Type(() => Number) @IsInt() @Min(1) pageSize = 20;
  @IsOptional() @IsString() search?: string;
}
