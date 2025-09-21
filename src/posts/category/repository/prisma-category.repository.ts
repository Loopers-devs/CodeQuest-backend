import { Category } from "../entities/category.entity";
import { DbCategory, ICategoryRepository } from "../interfaces";
import { PrismaService } from '../../../../src/prisma/prisma.service';

export class PrismaCategoryRepository implements ICategoryRepository{

    constructor(private readonly prismaService: PrismaService) {}

    async findById(id: string): Promise<Category | null> {
      const category = await this.prismaService.category.findUnique({
        where: { id },
      });
  
      if (!category) return null;
  
      return this.toEntity(category);
    }

  
    async findAll(): Promise<Category[]> {
      const categories = await this.prismaService.category.findMany();
      return categories.map(this.toEntity);
    }
  
    async create(
      data: Pick<Category, 'name' | 'description'>
    ): Promise<Category> {
      const created = await this.prismaService.category.create({
        data,
      });
  
      return this.toEntity(created);
    }
  
    async update(
      id: string,
      data: Partial<Pick<Category, 'name' | 'description'>>
    ): Promise<Category> {
      const updated = await this.prismaService.category.update({
        where: { id },
        data,
      });
  
      return this.toEntity(updated);
    }
  
    async delete(id: string): Promise<void> {
      await this.prismaService.category.delete({
        where: { id },
      });
    }
  
    toEntity(c: DbCategory): Category {
      return {
        id: c.id,
        name: c.name,
        description: c.description ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        deletedAt: c.deletedAt ?? null,
      };
    }
  
}