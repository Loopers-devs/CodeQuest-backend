import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostFavorite } from '../entities/post-favorite.entity';
import { DbPostFavorite, IPostFavoriteRepository } from '../interfaces';
import { Prisma } from '@prisma/client';
import { PostFavoriteListQueryDto } from '../dto/create-post-favorite.dto';

@Injectable()
export class PrismaPostFavoriteRepository implements IPostFavoriteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserAndPost(
    userId: number,
    postId: string,
  ): Promise<PostFavorite | null> {
    const favorite = await this.prismaService.postFavorite.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    return favorite ? this.toEntity(favorite) : null;
  }

  async findAll(dto: PostFavoriteListQueryDto) {
    const where: Prisma.PostFavoriteWhereInput = {};

    if (dto.userId) {
      where.userId = dto.userId;
    }

    if (dto.postId) {
      where.postId = dto.postId;
    }

    const skip = (dto.page - 1) * dto.pageSize;

    const [rows, total] = await this.prismaService.$transaction([
      this.prismaService.postFavorite.findMany({
        where,
        skip,
        take: dto.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.postFavorite.count({ where }),
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
    data: Pick<PostFavorite, 'userId' | 'postId'>,
  ): Promise<PostFavorite> {
    const created = await this.prismaService.postFavorite.create({
      data,
    });

    return this.toEntity(created);
  }

  async delete(userId: number, postId: string): Promise<void> {
    await this.prismaService.postFavorite.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  toEntity(f: DbPostFavorite): PostFavorite {
    return {
      userId: f.userId,
      postId: f.postId,
      createdAt: f.createdAt,
    };
  }
}
