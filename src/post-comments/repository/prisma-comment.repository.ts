// src/comments/repository/prisma-comment.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { DbComment, ICommentRepository } from '../interfaces';
import { Prisma } from '@prisma/client';
import { PostCommentEntity } from '../entities/post-comment.entity';
import { CommentListQueryDto } from '../dto/create-post-comment.dto';

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PostCommentEntity | null> {
    const row = await this.prisma.postComment.findUnique({
      where: { id },
      include: { author: true },
    });
    return row ? this.toEntity(row) : null;
  }

  async findAllByPost(dto: CommentListQueryDto) {
    const where: Prisma.PostCommentWhereInput = {
      postId: dto.postId,
      deletedAt: null,
      AND: [
        dto.parentId === undefined
          ? { parentId: null }
          : { parentId: dto.parentId || null },
        dto.search
          ? { content: { contains: dto.search, mode: 'insensitive' } }
          : {},
        {
          deletedAt: null,
        },
      ],
    };

    const skip = (dto.page - 1) * dto.pageSize;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.postComment.findMany({
        where,
        skip,
        take: dto.pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, nickname: true, fullName: true, image: true },
          },
          children: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: {
              author: {
                select: {
                  id: true,
                  nickname: true,
                  fullName: true,
                  image: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.postComment.count({ where }),
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

  async create(data: {
    postId: string;
    authorId: number;
    content: string;
    parentId?: string;
  }): Promise<PostCommentEntity> {
    const [comment] = await this.prisma.$transaction([
      this.prisma.postComment.create({
        data: {
          postId: data.postId,
          authorId: data.authorId,
          content: data.content,
          parentId: data.parentId,
        },
        include: {
          author: {
            select: { id: true, nickname: true, fullName: true, image: true },
          },
        },
      }),

      this.prisma.post.update({
        where: { id: data.postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return this.toEntity(comment);
  }

  async update(
    id: string,
    data: Partial<Pick<PostCommentEntity, 'content'>>,
  ): Promise<PostCommentEntity> {
    const updated = await this.prisma.postComment.update({
      where: { id },
      data: {
        content: data.content,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, nickname: true, fullName: true, image: true },
        },
      },
    });

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    const comment = await this.prisma.postComment.findUnique({ where: { id } });
    if (!comment) return;

    await this.prisma.$transaction([
      this.prisma.postComment.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
      this.prisma.post.update({
        where: { id: comment.postId },
        data: { commentsCount: { decrement: 1 } },
      }),
    ]);
  }

  private toEntity(c: DbComment): PostCommentEntity {
    return {
      id: c.id,
      postId: c.postId,
      authorId: c.authorId,
      author: {
        id: c.author.id,
        nickname: c.author.nickname,
        fullName: c.author.fullName,
        image: c.author.image,
      },
      content: c.content,
      parentId: c.parentId ?? undefined,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      deletedAt: c.deletedAt ?? null,
      children: c.children?.map((child) => this.toEntity(child)),
    };
  }
}
