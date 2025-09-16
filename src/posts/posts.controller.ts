// src/posts/posts.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostListQueryDto } from './dto/post-list-query.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ---------- Crear ----------

  @Post()
  @Auth()
  async create(@Body() dto: CreatePostDto, @GetUser('userId') userId: number) {
    return this.postsService.create(dto, userId);
  }

  // ---------- Actualizar ----------
  @Patch(':id')
  @Auth()
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePostDto,
    @GetUser('userId') userId: number,
  ) {
    return this.postsService.update(id, dto, userId);
  }

  // ---------- Publicar / Despublicar ----------
  @Post(':id/publish')
  @Auth()
  async publish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('userId') userId: number,
  ) {
    return this.postsService.publish(id, userId);
  }

  @Post(':id/unpublish')
  @Auth()
  async unpublish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('userId') userId: number,
  ) {
    return this.postsService.unpublish(id, userId);
  }

  // ---------- Borrado lógico / Restaurar ----------
  @Delete(':id')
  @Auth()
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('userId') userId: number,
  ) {
    await this.postsService.remove(id, userId);
    return { ok: true };
  }

  @Post(':id/restore')
  @Auth()
  async restore(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('userId') userId: number,
  ) {
    return this.postsService.restore(id, userId);
  }

  // ---------- Lecturas ----------
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string, @Query('view') view?: string) {
    // ?view=false para NO incrementar vistas (por ejemplo, pre-render)
    const increaseView = view === 'false' ? false : true;
    return this.postsService.findBySlug(slug, increaseView);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postsService.findById(id);
  }

  // ---------- Feed / Listados ----------
  @Get()
  async list(
    @Query()
    query: PostListQueryDto,
  ) {
    return this.postsService.list(query);
  }

  @Get('author/:authorId')
  async listByAuthor(
    @Param('authorId') authorId: string,
    @Query()
    query: PostListQueryDto,
  ) {
    return this.postsService.listByAuthor(Number(authorId), query);
  }

  @Get(':id/related')
  async listRelated(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('limit') limit?: string,
  ) {
    const n = limit ? Number(limit) : 3;
    return this.postsService.listRelated(id, n);
  }

  // ---------- Reacciones (opcional) ----------
  @Post(':id/reactions')
  @Auth()
  async addReaction(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.addReaction(id);
    return { ok: true };
  }

  @Delete(':id/reactions')
  @Auth()
  async removeReaction(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.removeReaction(id);
    return { ok: true };
  }
}
