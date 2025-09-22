import { Prisma } from '@prisma/client';
import { CommentListQueryDto } from '../dto/create-post-comment.dto';
import { PostCommentEntity } from '../entities/post-comment.entity';

export interface ICommentRepository {
  findById(id: string): Promise<PostCommentEntity | null>;
  findAllByPost(
    postId: string,
    query: CommentListQueryDto,
  ): Promise<{
    items: PostCommentEntity[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>;
  create(data: {
    postId: string;
    authorId: number;
    content: string;
    parentId?: string;
  }): Promise<PostCommentEntity>;
  update(
    id: string,
    data: Partial<Pick<PostCommentEntity, 'content'>>,
  ): Promise<PostCommentEntity>;
  delete(id: string): Promise<void>;
}

export type DbComment = Prisma.PostCommentGetPayload<object>;
