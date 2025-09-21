import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { PostFavoritesService } from './post-favorites.service';
import {
  CreatePostFavoriteDto,
  FindManyPostFavoritesDto,
  PostIsFavoriteDto,
} from './dto/create-post-favorite.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('post-favorites')
export class PostFavoritesController {
  constructor(private readonly postFavoritesService: PostFavoritesService) {}

  @Post()
  @Auth()
  create(
    @Body() createPostFavoriteDto: CreatePostFavoriteDto,
    @GetUser('userId') userId: number,
  ) {
    const { postId } = createPostFavoriteDto;

    return this.postFavoritesService.create({ userId, postId });
  }

  @Delete()
  @Auth()
  remove(
    @Body() createPostFavoriteDto: CreatePostFavoriteDto,
    @GetUser('userId') userId: number,
  ) {
    const { postId } = createPostFavoriteDto;

    return this.postFavoritesService.remove({ userId, postId });
  }

  @Post('is-favorite')
  isFavorite(@Body() createPostFavoriteDto: PostIsFavoriteDto) {
    return this.postFavoritesService.isFavorite(createPostFavoriteDto);
  }

  @Get()
  @Auth()
  findAll(
    @GetUser('userId') userId: number,
    @Query() opts?: FindManyPostFavoritesDto,
  ) {
    return this.postFavoritesService.findAll(userId, opts);
  }
}
