import { Prisma } from '@prisma/client';
import { Tag } from '../entities/tag.entity';

export interface ITagRepository {
  findById(id: string): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  create(tag: Pick<Tag, 'name' | 'description'>): Promise<Tag>;
  update(
    id: string,
    data: Partial<Pick<Tag, 'name' | 'description'>>,
  ): Promise<Tag>;
  delete(id: string): Promise<void>;
}

export type DbTag = Prisma.TagsGetPayload<object>;
