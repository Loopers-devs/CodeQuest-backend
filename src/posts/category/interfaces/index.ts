import { Prisma } from '@prisma/client';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(category: Pick<Category, 'name' | 'description'>): Promise<Category>;
  update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'description'>>,
  ): Promise<Category>;
  delete(id: string): Promise<void>;
}

export type DbCategory = Prisma.CategoryGetPayload<object>;
