import { Category, Prisma } from '@prisma/client';
import { Tag } from '../entities/tag.entity';
import { TagListQueryDto } from '../dto/create-tag.dto';

export interface ITagRepository {
  findById(id: string): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findAll(query: TagListQueryDto): Promise<{
    items: Tag[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
  create(tag: Pick<Tag, 'name' | 'description'>): Promise<Tag>;
  update(
    id: string,
    data: Partial<Pick<Tag, 'name' | 'description'>>,
  ): Promise<Tag>;
  delete(id: string): Promise<void>;
}

export type DbTag = Prisma.TagsGetPayload<object>;
