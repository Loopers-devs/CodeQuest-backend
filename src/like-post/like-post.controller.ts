import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LikeListQueryDto } from './dto/create-like-post.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { LikePostService } from './like-post.service';

@ApiTags('Post Likes')
@Controller('like')
export class LikePostController {
  constructor(private readonly likePostService: LikePostService) {}

  @Post(':id')
  @Auth()
  @ApiOperation({ summary: 'Dar like a un post' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post' })
  @ApiResponse({ status: 201, description: 'Like registrado correctamente' })
  @ApiResponse({ status: 400, description: 'Ya existe el like' })
  async addLike(
    @Param('id', new ParseUUIDPipe()) postId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.likePostService.create({ postId, userId });
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Quitar el like de un post' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post' })
  @ApiResponse({ status: 200, description: 'Like eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Like no encontrado' })
  async removeLike(
    @Param('id', new ParseUUIDPipe()) postId: string,
    @GetUser('userId') userId: number,
  ) {
    await this.likePostService.delete(userId, postId);
    return { ok: true };
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Listar likes del usuario autenticado' })
  async listLikes(
    @Query() query: LikeListQueryDto,
    @GetUser('userId') userId: number,
  ) {
    return this.likePostService.findAll({ ...query, userId });
  }
}
