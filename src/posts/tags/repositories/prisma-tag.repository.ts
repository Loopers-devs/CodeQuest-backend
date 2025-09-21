import { Tag } from '../entities/tag.entity';
import { DbTag, ITagRepository } from '../interfaces';
import { PrismaService } from '../../../../src/prisma/prisma.service';

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

  async findAll(): Promise<Tag[]> {
    const tags = await this.prismaService.tags.findMany();
    return tags.map(this.toEntity);
  }

  async create(
    data: Pick<Tag, 'name' | 'description'>
  ): Promise<Tag> {
    const created = await this.prismaService.tags.create({
      data,
    });

    return this.toEntity(created);
  }

  async update(
    id: string,
    data: Partial<Pick<Tag, 'name' | 'description'>>
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
