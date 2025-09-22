import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IPostFavoriteRepository } from './interfaces';
import { PostFavorite } from './entities/post-favorite.entity';
import { CreatePostFavoriteDto, PostFavoriteListQueryDto } from './dto/create-post-favorite.dto';

@Injectable()
export class PostFavoriteService {
  constructor(
    @Inject('PostFavoriteRepository')
    private readonly postFavoriteRepository: IPostFavoriteRepository,
  ) {}

  async create(createDto: CreatePostFavoriteDto): Promise<PostFavorite> {
    const existing = await this.postFavoriteRepository.findByUserAndPost(
      createDto.userId,
      createDto.postId,
    );

    if (existing) {
      throw new BadRequestException('Este post ya está marcado como favorito por el usuario');
    }

    return this.postFavoriteRepository.create({
      userId: createDto.userId,
      postId: createDto.postId,
    });
  }

  async findAll(query: PostFavoriteListQueryDto) {
    return this.postFavoriteRepository.findAll(query);
  }

  async delete(userId: number, postId: string): Promise<void> {
    const favorite = await this.postFavoriteRepository.findByUserAndPost(userId, postId);

    if (!favorite) {
      throw new BadRequestException('El favorito no existe');
    }

    await this.postFavoriteRepository.delete(userId, postId);
  }
}

