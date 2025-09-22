import { Prisma } from '@prisma/client';
import { PostFavorite } from '../entities/post-favorite.entity';
import { PostFavoriteListQueryDto } from '../dto/create-post-favorite.dto';


export interface IPostFavoriteRepository {

  findByUserAndPost(userId: number, postId: string): Promise<PostFavorite | null>;

  findAll(query: PostFavoriteListQueryDto): Promise<{
    items: PostFavorite[],
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;

  create(favorite: Pick<PostFavorite, 'userId' | 'postId'>): Promise<PostFavorite>;

  delete(userId: number, postId: string): Promise<void>;
}

export type DbPostFavorite = Prisma.PostFavoriteGetPayload<object>;

