import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  IPostRepository,
  DbPost,
  PostListParams,
  PagedResult,
  CreatePostData,
  UpdatePostData,
  PostSortBy,
  SortOrder,
} from 'src/posts/interfaces';
import { PostStatus, PostVisibility } from 'src/interfaces';

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<DbPost | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<DbPost | null> {
    return this.prisma.post.findUnique({ where: { slug } });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const existSlug = await this.prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !!existSlug;
  }

  async list(params?: PostListParams): Promise<PagedResult<DbPost>> {
    const take = params?.take ?? 10;
    const where = this.buildWhere(params);
    const orderBy = this.buildOrderBy(params?.sortBy, params?.order);

    const includeFavorite =
      params?.userId && (params?.includes ?? []).includes('favorites')
        ? {
            favoritedBy: {
              where: { userId: params.userId },
              select: { userId: true },
              take: 1,
            },
          }
        : {};

    const items = await this.prisma.post.findMany({
      where,
      orderBy,
      take,
      skip: params?.cursor
        ? undefined
        : take * (params?.paginate ? params?.paginate - 1 : 0),
      include: {
        ...includeFavorite,
        ...((params?.includes ?? []).includes('author') && {
          author: {
            select: {
              id: true,
              fullName: true,
              nickname: true,
              image: true,
            },
          },
        }),
      },
      ...(params?.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    });

    const count = await this.prisma.post.count({ where });

    const nextCursor =
      items.length === take ? items[items.length - 1].id : null;

    const totalPages = Math.ceil(count / take);
    const currentPage =
      items.length > 0
        ? Math.ceil((params?.cursor ? (params?.take ?? 10) + 1 : 1) / take)
        : 0;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      items: items.map((item) => ({
        ...item,
        isFavorited: item.favoritedBy ? item.favoritedBy.length > 0 : false,
      })),
      nextCursor,
      metadata: {
        totalPages,
        currentPage,
        nextPage,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  }

  async listByAuthor(
    authorId: number,
    params?: Omit<PostListParams, 'authorId'>,
  ): Promise<PagedResult<DbPost>> {
    return this.list({ ...(params ?? {}), authorId });
  }

  async listRelated(id: string, limit = 3): Promise<DbPost[]> {
    const base = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true, category: true, tags: true },
    });
    if (!base) return [];

    const where: Prisma.PostWhereInput = {
      id: { not: base.id },
      deletedAt: null,
      status: PostStatus.PUBLISHED,
      visibility: PostVisibility.PUBLIC,
      OR: [
        base.category ? { category: base.category } : undefined,
        base.tags?.length ? { tags: { hasSome: base.tags } } : undefined,
      ].filter(Boolean) as Prisma.PostWhereInput[],
    };

    return this.prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  // =============== Escrituras ===============
  async create(data: CreatePostData): Promise<DbPost> {
    return this.prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        content: data.content,
        category: data.category,
        tags: data.tags,
        status: data.status,
        visibility: data.visibility,
        coverImageUrl: data.coverImageUrl,
        authorId: data.authorId, // toma del usuario autenticado (no del cliente)
        // Opcional: setear publishedAt si creas como PUBLISHED
        // publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async update(id: string, data: UpdatePostData): Promise<DbPost> {
    return this.prisma.post.update({ where: { id }, data });
  }

  async updateBySlug(slug: string, data: UpdatePostData): Promise<DbPost> {
    return this.prisma.post.update({ where: { slug }, data });
  }

  // =============== Ciclo de publicación ===============
  async publish(id: string): Promise<DbPost> {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(id: string): Promise<DbPost> {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.DRAFT,
        publishedAt: null,
      },
    });
  }

  // =============== Borrado lógico / restauración ===============
  async softDelete(id: string): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<DbPost> {
    return this.prisma.post.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  // =============== Contadores atómicos ===============
  async incrementViews(id: string, by = 1): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { views: { increment: by } },
    });
  }

  async incrementCommentsCount(id: string, by: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { commentsCount: { increment: by } },
    });
  }

  async incrementReactionsCount(id: string, by: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: { reactionsCount: { increment: by } },
    });
  }

  async findManyByIds(ids: string[]): Promise<DbPost[]> {
    if (!ids.length) return [];
    const posts = await this.prisma.post.findMany({
      where: { id: { in: ids } },
      include: {
        author: {
          select: { id: true, fullName: true, nickname: true, image: true },
        },
      },
    });

    return posts.map((item) => ({
      ...item,
      isFavorited: true,
    }));
  }

  // =============== Helpers privados ===============
  private buildWhere(params?: PostListParams): Prisma.PostWhereInput {
    const p = params ?? {};
    const where: Prisma.PostWhereInput = {};

    // Excluir borrados por defecto
    if (p.excludeDeleted !== false) where.deletedAt = null;

    if (p.publishedOnly) {
      where.status = PostStatus.PUBLISHED;
      where.visibility = PostVisibility.PUBLIC;
    }
    if (p.status) where.status = p.status;
    if (p.visibility) where.visibility = p.visibility;
    if (p.authorId != null) where.authorId = p.authorId;
    if (p.category != null) where.category = p.category;

    if (p.tags?.length) {
      // Para String[] en Prisma
      where.tags = { hasSome: p.tags };
      // Si es relación many-to-many:
      // where.tags = { some: { name: { in: p.tags } } };
    }

    if (p.search?.trim()) {
      const q = p.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (p.dateFrom || p.dateTo) {
      // normalmente el feed se filtra por publishedAt
      where.publishedAt = {
        ...(p.dateFrom ? { gte: p.dateFrom } : {}),
        ...(p.dateTo ? { lte: p.dateTo } : {}),
      };
    }

    return where;
  }

  private buildOrderBy(
    sortBy?: PostSortBy,
    order?: SortOrder,
  ): Prisma.PostOrderByWithRelationInput {
    const sb = sortBy ?? 'publishedAt';
    const ord = order ?? 'desc';
    return { [sb]: ord } as Prisma.PostOrderByWithRelationInput;
  }
}
