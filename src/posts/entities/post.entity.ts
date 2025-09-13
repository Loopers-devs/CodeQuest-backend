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

export class PostEntity {

    @IsUUID()
    id: string;

    @IsString()
    @MinLength(5)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    title: string;

    @IsString()
    @MinLength(5)
    @Transform(({ value }) => toSlug(value))
    slug: string;

    @IsOptional()
    @IsString()
    @MaxLength(280) 
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    summary: string | null;

    @IsString()
    @MinLength(10)
    content: string; 


    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    category: string | null;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        Array.isArray(value)
            ? [...new Set(value.map((t: string) => t.trim().toLowerCase()))]
            : value,
    )
    tags: string[];

    @IsEnum(PostStatus)
    status: PostStatus;

    @IsEnum(PostVisibility)
    visibility: PostVisibility;

    @IsOptional()
    @IsUrl()
    coverImageUrl: string | null;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    publishedAt: Date | null;

    @IsInt()
    @Min(0)
    views: number;

    @IsInt()
    @Min(0)
    commentsCount: number;

    @IsInt()
    @Min(0)
    reactionsCount: number;

    // Auditoría
    @Type(() => Date)
    createdAt: Date;

    @Type(() => Date)
    updatedAt: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    deletedAt: Date | null;

    @IsInt()
    authorId: number;
}
