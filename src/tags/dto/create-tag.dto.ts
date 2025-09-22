import { PickType } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTagDto extends PickType(Tag, [
  'name',
  'description',
] as const) {}

export class TagListQueryDto {
  @Type(() => Number) @IsInt() @Min(1) page = 1;
  @Type(() => Number) @IsInt() @Min(1) pageSize = 1;
  @IsOptional() @IsString() search?: string;
}
