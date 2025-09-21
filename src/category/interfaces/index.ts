import { Prisma } from '@prisma/client';
import { Category } from '../entities/category.entity';
import { CategoryListQueryDto } from '../dto/create-category.dto';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(query: CategoryListQueryDto): Promise<{
    items: Category[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
  create(category: Pick<Category, 'name' | 'description'>): Promise<Category>;
  update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'description'>>,
  ): Promise<Category>;
  delete(id: string): Promise<void>;
}

export type DbCategory = Prisma.CategoryGetPayload<object>;
