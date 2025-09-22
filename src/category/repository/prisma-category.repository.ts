import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '../entities/category.entity';
import { DbCategory, ICategoryRepository } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { CategoryListQueryDto } from '../dto/create-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return this.toEntity(category);
  }

  async findAll(dto: CategoryListQueryDto) {
    const where: Prisma.CategoryWhereInput = dto.search
      ? {
          OR: [
            { name: { contains: dto.search, mode: 'insensitive' } },
            { description: { contains: dto.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const skip = (dto.page - 1) * dto.pageSize;

    const [rows, total] = await this.prismaService.$transaction([
      this.prismaService.category.findMany({
        where,
        skip,
        take: dto.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.category.count({ where }),
    ]);

    const totalPages = Math.ceil(total / dto.pageSize);

    return {
      items: rows.map((r) => this.toEntity(r)),
      page: dto.page,
      pageSize: dto.pageSize,
      total,
      totalPages,
      hasNext: dto.page < totalPages,
      hasPrev: dto.page > 1,
    };
  }

  async create(
    data: Pick<Category, 'name' | 'description'>,
  ): Promise<Category> {
    const created = await this.prismaService.category.create({
      data,
    });

    return this.toEntity(created);
  }

  async update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'description'>>,
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
