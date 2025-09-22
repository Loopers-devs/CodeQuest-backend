import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostFavoriteService } from './post-favorite.service';
import { PostFavoriteListQueryDto } from './dto/create-post-favorite.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Post Favorites')
@Controller('post-favorites')
export class PostFavoriteController {
  constructor(private readonly postFavoriteService: PostFavoriteService) {}

  @Post(':id')
  @Auth()
  @ApiOperation({ summary: 'Marcar un post como favorito' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post' })
  @ApiResponse({ status: 201, description: 'Favorito creado correctamente' })
  @ApiResponse({ status: 400, description: 'Ya existe el favorito' })
  async addFavorite(
    @Param('id', new ParseUUIDPipe()) postId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.postFavoriteService.create({ postId, userId });
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Quitar un post de favoritos' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post' })
  @ApiResponse({ status: 200, description: 'Favorito eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Favorito no encontrado' })
  async removeFavorite(
    @Param('id', new ParseUUIDPipe()) postId: string,
    @GetUser('userId') userId: number,
  ) {
    await this.postFavoriteService.delete(userId, postId);
    return { ok: true };
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Listar favoritos del usuario autenticado' })
  async listFavorites(
    @Query() query: PostFavoriteListQueryDto,
    @GetUser('userId') userId: number,
  ) {
    return this.postFavoriteService.findAll({ ...query, userId });
  }
}
