import { Prisma } from '@prisma/client';
import { LikePost } from '../entities/like-post.entity';
import { LikeListQueryDto } from '../dto/create-like-post.dto';

export interface ILikePostRepository {
  findByUserAndPost(userId: number, postId: string): Promise<LikePost | null>;

  findAll(query: LikeListQueryDto): Promise<{
    items: LikePost[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;

  create(like: Pick<LikePost, 'userId' | 'postId'>): Promise<LikePost>;

  delete(userId: number, postId: string): Promise<void>;
}

export type DbLikePost = Prisma.PostLikeGetPayload<object>;
