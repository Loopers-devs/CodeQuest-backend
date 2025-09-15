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
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostListParams } from './interfaces';
import { PostStatus, PostVisibility } from 'src/interfaces';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ---------- Crear ----------
  
  @Post()
  @Auth()
  async create(@Body() dto: CreatePostDto, @Req() req: Request) {
    
    const authorId = (req.user as any)?.userId; 
    return this.postsService.create(dto, authorId);
  }

  // ---------- Actualizar ----------
  @Patch(':id')
  @Auth()
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const currentUserId = (req.user as any)?.userId;
    return this.postsService.update(id, dto, currentUserId);
  }

  // ---------- Publicar / Despublicar ----------
  @Post(':id/publish')
  @Auth()
  async publish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const currentUserId = (req.user as any)?.userId;
    return this.postsService.publish(id, currentUserId);
  }

  @Post(':id/unpublish')
  @Auth()
  async unpublish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const currentUserId = (req.user as any)?.userId;
    return this.postsService.unpublish(id, currentUserId);
  }

  // ---------- Borrado lógico / Restaurar ----------
  @Delete(':id')
  @Auth()
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const currentUserId = (req.user as any)?.userId;
    await this.postsService.remove(id, currentUserId);
    return { ok: true };
  }

  @Post(':id/restore')
  @Auth()
  async restore(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const currentUserId = (req.user as any)?.userId;
    return this.postsService.restore(id, currentUserId);
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
  async list(@Query() q: any) {
    // Parseo ligero de query -> PostListParams
    console.log({query:q.search});
    
    const params: PostListParams = {
      search: q.search,
      authorId: q.authorId ? Number(q.authorId) : undefined,
      category: q.category ?? undefined,
      tags: q.tags
        ? String(q.tags)
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : undefined,
      status: q.status as PostStatus | undefined,
      visibility: q.visibility as PostVisibility | undefined,
      publishedOnly:
        typeof q.publishedOnly === 'string'
          ? q.publishedOnly !== 'false'
          : undefined,
      dateFrom: q.dateFrom ? new Date(q.dateFrom) : undefined,
      dateTo: q.dateTo ? new Date(q.dateTo) : undefined,
      sortBy: q.sortBy,
      order: q.order,
      cursor: q.cursor,
      take: q.take ? Number(q.take) : undefined,
    };

    return this.postsService.list(params);
  }

  @Get('author/:authorId')
  async listByAuthor(@Param('authorId') authorId: string, @Query() q: any) {
    const params: Omit<PostListParams, 'authorId'> = {
      search: q.search,
      category: q.category ?? undefined,
      tags: q.tags
        ? String(q.tags)
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : undefined,
      status: q.status as PostStatus | undefined,
      visibility: q.visibility as PostVisibility | undefined,
      dateFrom: q.dateFrom ? new Date(q.dateFrom) : undefined,
      dateTo: q.dateTo ? new Date(q.dateTo) : undefined,
      sortBy: q.sortBy,
      order: q.order,
      cursor: q.cursor,
      take: q.take ? Number(q.take) : undefined,
      // publishedOnly lo puedes permitir aquí si quieres solo públicos del autor
      publishedOnly:
        typeof q.publishedOnly === 'string'
          ? q.publishedOnly !== 'false'
          : undefined,
    };

    return this.postsService.listByAuthor(Number(authorId), params);
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
