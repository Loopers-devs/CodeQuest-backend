import { Tag } from '../entities/tag.entity';
import { DbTag, ITagRepository } from '../interfaces';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { TagListQueryDto } from '../dto/create-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaTagRepository implements ITagRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prismaService.tags.findUnique({
      where: { id },
    });

    if (!tag) return null;

    return this.toEntity(tag);
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await this.prismaService.tags.findUnique({
      where: { name },
    });

    if (!tag) return null;

    return this.toEntity(tag);
  }

  async findAll(dto: TagListQueryDto) {
    const where: Prisma.TagsWhereInput = dto.search
      ? {
          OR: [
            { name: { contains: dto.search, mode: 'insensitive' } },
            { description: { contains: dto.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const skip = (dto.page - 1) * dto.pageSize;

    const [rows, total] = await this.prismaService.$transaction([
      this.prismaService.tags.findMany({
        where,
        skip,
        take: dto.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.tags.count({ where }),
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

    /* const tags = await this.prismaService.tags.findMany();
    return tags.map(this.toEntity); */
  }

  async create(data: Pick<Tag, 'name' | 'description'>): Promise<Tag> {
    const created = await this.prismaService.tags.create({
      data,
    });

    return this.toEntity(created);
  }

  async update(
    id: string,
    data: Partial<Pick<Tag, 'name' | 'description'>>,
  ): Promise<Tag> {
    const updated = await this.prismaService.tags.update({
      where: { id },
      data,
    });

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.tags.delete({
      where: { id },
    });
  }

  toEntity(t: DbTag): Tag {
    return {
      id: t.id,
      name: t.name,
      description: t.description ?? undefined,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      deletedAt: t.deletedAt ?? null,
    };
  }
}
