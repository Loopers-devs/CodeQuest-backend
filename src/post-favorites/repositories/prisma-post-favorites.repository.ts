import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IPostFavoritesRepository } from '../interfaces';

@Injectable()
export class PrismaPostFavoritesRepository implements IPostFavoritesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async addFavorite(userId: number, postId: string): Promise<void> {
    await this.prismaService.postFavorite.create({ data: { userId, postId } });
  }

  async removeFavorite(userId: number, postId: string): Promise<void> {
    await this.prismaService.postFavorite.delete({
      where: { userId_postId: { userId, postId } },
    });
  }
  async isFavorite(userId: number, postId: string): Promise<boolean> {
    const favorite = await this.prismaService.postFavorite.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    return !!favorite;
  }

  async getFavoritesByUser(
    userId: number,
    opts?: { take?: number; cursor: string | null; relations?: string[] },
  ): Promise<{
    favorites: { userId: number; postId: string; createdAt: Date }[];
    nextCursor: string | null;
  }> {
    const take = Math.max(1, Math.min(opts?.take ?? 20, 100));

    const favorites = await this.prismaService.postFavorite.findMany({
      where: { userId },
      take: take + 1,
      cursor: opts?.cursor
        ? { userId_postId: { userId, postId: opts.cursor } }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: opts?.relations?.includes('post') ? { post: true } : undefined,
    });

    let nextCursor: string | null = null;
    let result = favorites;

    if (favorites.length > take) {
      const lastFavorite = favorites[favorites.length - 1];
      nextCursor = lastFavorite.postId;
      result = favorites.slice(0, take);
    }

    return {
      favorites: result,
      nextCursor,
    };
  }
}
