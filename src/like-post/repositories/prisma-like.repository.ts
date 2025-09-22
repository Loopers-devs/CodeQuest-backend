import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikePost } from '../entities/like-post.entity';
import { Prisma } from '@prisma/client';
import { LikeListQueryDto } from '../dto/create-like-post.dto';
import { DbLikePost, ILikePostRepository } from '../interfaces';

@Injectable()
export class PrismaLikePostRepository implements ILikePostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserAndPost(userId: number, postId: string): Promise<LikePost | null> {
    const like = await this.prismaService.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    return like ? this.toEntity(like) : null;
  }

  async findAll(dto: LikeListQueryDto) {
    const where: Prisma.PostLikeWhereInput = {};

    if (dto.userId) {
      where.userId = dto.userId;
    }

    if (dto.postId) {
      where.postId = dto.postId;
    }

    const skip = (dto.page - 1) * dto.pageSize;

    const [rows, total] = await this.prismaService.$transaction([
      this.prismaService.postLike.findMany({
        where,
        skip,
        take: dto.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.postLike.count({ where }),
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

  async create(data: Pick<LikePost, 'userId' | 'postId'>): Promise<LikePost> {
    const created = await this.prismaService.postLike.create({
      data,
    });

    return this.toEntity(created);
  }

  async delete(userId: number, postId: string): Promise<void> {
    await this.prismaService.postLike.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  toEntity(like: DbLikePost): LikePost {
    return {
      userId: like.userId,
      postId: like.postId,
      createdAt: like.createdAt,
    };
  }
}
