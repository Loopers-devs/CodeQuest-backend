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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ---------- Crear ----------

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Crear un nuevo Post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post Creado Correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear el Post' })
  async create(@Body() dto: CreatePostDto, @GetUser('userId') userId: number) {
    console.log({ dto: dto, userid: userId });

    return this.postsService.create(dto, userId);
  }

  // ---------- Actualizar ----------
  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Actualizar un post existente' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del post a actualizar',
  })
  @ApiBody({ type: UpdatePostDto }) // El cuerpo de la solicitud será de tipo UpdatePostDto
  @ApiResponse({ status: 200, description: 'Post actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Post no encontrado' })
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
  @ApiOperation({ summary: 'Publicar un post' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post a publicar' })
  @ApiResponse({ status: 200, description: 'Post publicado correctamente' })
  async publish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('userId') userId: number,
  ) {
    return this.postsService.publish(id, userId);
  }

  @Post(':id/unpublish')
  @Auth()
  @ApiOperation({ summary: 'Despublicar un post' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del post a despublicar',
  })
  @ApiResponse({ status: 200, description: 'Post despublicado correctamente' })
  async unpublish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('userId') userId: number,
  ) {
    return this.postsService.unpublish(id, userId);
  }

  // ---------- Borrado lógico / Restaurar ----------
  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Eliminar un post' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post a eliminar' })
  @ApiResponse({ status: 200, description: 'Post eliminado correctamente' })
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
  @ApiOperation({ summary: 'Obtener un post por slug' })
  @ApiParam({ name: 'slug', type: String, description: 'Slug del post' })
  @ApiResponse({ status: 200, description: 'Post encontrado' })
  @ApiResponse({ status: 404, description: 'Post no encontrado' })
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
  @ApiOperation({ summary: 'Listar todos los posts' })
  @ApiResponse({ status: 200, description: 'Lista de posts' })
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
  @ApiOperation({ summary: 'Agregar una reacción a un post' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post' })
  @ApiResponse({ status: 200, description: 'Reacción agregada correctamente' })
  @Post(':id/reactions')
  @Auth()
  async addReaction(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.addReaction(id);
    return { ok: true };
  }

  @Delete(':id/reactions')
  @Auth()
  @ApiOperation({ summary: 'Eliminar una reacción de un post' })
  @ApiParam({ name: 'id', type: String, description: 'ID del post' })
  @ApiResponse({ status: 200, description: 'Reacción eliminada correctamente' })
  async removeReaction(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.removeReaction(id);
    return { ok: true };
  }
}
