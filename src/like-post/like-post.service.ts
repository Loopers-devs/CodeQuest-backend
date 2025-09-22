import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LikePost } from './entities/like-post.entity';
import {
  CreateLikePostDto,
  LikeListQueryDto,
} from './dto/create-like-post.dto';
import type{ ILikePostRepository } from './interfaces';

@Injectable()
export class LikePostService {
  constructor(
    @Inject('LikePostRepository')
    private readonly likePostRepository: ILikePostRepository,
  ) {}

  async create(createDto: CreateLikePostDto): Promise<LikePost> {
    const existing = await this.likePostRepository.findByUserAndPost(
      createDto.userId,
      createDto.postId,
    );

    if (existing) {
      throw new BadRequestException('Este post ya tiene un like de este usuario');
    }

    return this.likePostRepository.create({
      userId: createDto.userId,
      postId: createDto.postId,
    });
  }

  async findAll(query: LikeListQueryDto) {
    return this.likePostRepository.findAll(query);
  }

  async delete(userId: number, postId: string): Promise<void> {
    const like = await this.likePostRepository.findByUserAndPost(userId, postId);

    if (!like) {
      throw new BadRequestException('El like no existe');
    }

    await this.likePostRepository.delete(userId, postId);
  }
}
