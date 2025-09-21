import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  FindManyPostFavoritesDto,
  PostIsFavoriteDto,
} from './dto/create-post-favorite.dto';
import type { IPostFavoritesRepository } from './interfaces';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostFavoritesService {
  constructor(
    @Inject('PostFavoritesRepository')
    private readonly postFavoritesRepository: IPostFavoritesRepository,
    private readonly postsService: PostsService,
  ) {}

  async create(createPostFavoriteDto: { userId: number; postId: string }) {
    const { userId, postId } = createPostFavoriteDto;

    try {
      await this.postFavoritesRepository.addFavorite(userId, postId);
    } catch {
      throw new InternalServerErrorException('Error adding favorite');
    }
  }

  remove(createPostFavoriteDto: { userId: number; postId: string }) {
    const { userId, postId } = createPostFavoriteDto;

    return this.postFavoritesRepository.removeFavorite(userId, postId);
  }

  async isFavorite(createPostFavoriteDto: PostIsFavoriteDto) {
    return this.postFavoritesRepository.isFavorite(
      createPostFavoriteDto.userId,
      createPostFavoriteDto.postId,
    );
  }

  async findAll(userId: number, opts?: FindManyPostFavoritesDto) {
    // Obtiene los favoritos del usuario (solo IDs)
    const { favorites, nextCursor } =
      await this.postFavoritesRepository.getFavoritesByUser(userId, opts);
    if (!favorites.length) {
      return { items: [], nextCursor };
    }
    // Obtiene los posts completos usando los IDs (batch)
    const postIds = favorites.map((fav) => fav.postId);
    const posts = await this.postsService.findManyByIds(postIds);
    return { items: posts, nextCursor };
  }
}
