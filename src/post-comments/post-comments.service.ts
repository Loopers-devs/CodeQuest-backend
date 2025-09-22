import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ICommentRepository } from './interfaces';
import { PostsService } from 'src/posts/posts.service';
import {
  CommentListQueryDto,
  CreateCommentDto,
} from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';

@Injectable()
export class PostCommentsService {
  constructor(
    @Inject('CommentRepository')
    private readonly postCommentRepository: ICommentRepository,
    private readonly postsService: PostsService,
  ) {}

  async create(authorId: number, dto: CreateCommentDto) {
    const post = await this.postsService.findById(dto.postId);
    if (!post) throw new BadRequestException('Post not found');

    if (dto.parentId) {
      const parent = await this.postCommentRepository.findById(dto.parentId);
      if (!parent) throw new BadRequestException('Parent comment not found');
      if (parent.postId !== dto.postId)
        throw new BadRequestException('Parent belongs to another post');
    }

    return this.postCommentRepository.create({
      postId: dto.postId,
      authorId,
      content: dto.content,
      parentId: dto.parentId,
    });
  }

  async findById(id: string) {
    const comment = await this.postCommentRepository.findById(id);
    if (!comment) throw new BadRequestException('Comment not found');
    return comment;
  }

  async listByPost(query: CommentListQueryDto) {
    // parentId undefined => top-level; parentId set => hijos de ese comentario
    return this.postCommentRepository.findAllByPost(query);
  }

  async update(id: string, authorId: number, dto: UpdatePostCommentDto) {
    const comment = await this.postCommentRepository.findById(id);
    if (!comment) throw new BadRequestException('Comment not found');
    if (comment.authorId !== authorId)
      throw new BadRequestException('Not authorized');
    return this.postCommentRepository.update(id, { content: dto.content });
  }

  async delete(id: string, authorId: number): Promise<void> {
    const comment = await this.postCommentRepository.findById(id);
    if (!comment) throw new BadRequestException('Comment not found');
    if (comment.authorId !== authorId)
      throw new BadRequestException('Not authorized');
    await this.postCommentRepository.delete(id);
  }
}
