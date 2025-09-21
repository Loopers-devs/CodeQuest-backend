import { Type, Transform } from 'class-transformer';
import type { PostSortBy, SortOrder, PostInclude } from '../interfaces';
import { PostIncludes } from '../interfaces';
import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  ArrayUnique,
  IsEnum,
  IsBoolean,
  IsDate,
  Min,
  IsIn,
  IsUUID,
} from 'class-validator';
import { PostStatus, PostVisibility } from 'src/interfaces';

export class PostListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  })
  @IsInt()
  authorId?: number;

  @IsOptional()
  @IsUUID()
  category?: string | null;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (Array.isArray(value))
      return value.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
    return String(value)
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
  })
  @IsArray()
  @ArrayUnique()
  tags?: string[];

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    const s = String(value).toLowerCase();
    if (s === 'false') return false;
    if (s === 'true') return true;
    return undefined;
  })
  @IsBoolean()
  publishedOnly?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

  @IsOptional()
  @IsIn([
    'publishedAt',
    'createdAt',
    'views',
    'reactionsCount',
    'commentsCount',
  ])
  sortBy?: PostSortBy;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: SortOrder;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  })
  @IsInt()
  @Min(1)
  take?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (Array.isArray(value))
      return value.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
    return String(value)
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
  })
  @IsArray()
  @ArrayUnique()
  @IsIn([...PostIncludes], { each: true })
  includes?: PostInclude[];
}
