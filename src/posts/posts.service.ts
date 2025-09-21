// src/posts/posts.service.ts
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type IPostRepository,
  DbPost,
  PostListParams,
  PagedResult,
  CreatePostData,
  UpdatePostData,
  PostResponseDto,
} from './interfaces';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus, PostVisibility } from 'src/interfaces';

@Injectable()
export class PostsService {
  constructor(
    @Inject('PostRepository')
    private readonly postRepo: IPostRepository,
  ) { }

  // ============== Creación ==============
  async create(dto: CreatePostDto, authorId: number): Promise<DbPost> {
    // (Opcional) si el slug lo manda el cliente, valida unicidad
    if (dto.slug && (await this.postRepo.existsBySlug(dto.slug))) {
      throw new ConflictException('El slug ya está en uso');
    }

    const data: CreatePostData = {
      ...dto,
      authorId, // NUNCA confiar en el authorId del cliente
    };

    // Si creas como publicado y no tienes publishedAt, el repo puede setearlo
    // o lo puedes hacer aquí si lo prefieres.
    return this.postRepo.create(data);
  }

  // ============== Actualización ==============
  async update(
    id: string,
    dto: UpdatePostDto,
    currentUserId: number,
  ): Promise<DbPost> {
    const existing = await this.postRepo.findById(id);
    if (!existing) throw new NotFoundException('Post no encontrado');

    // Ownership (ajusta si tienes roles/admin)
    if (existing.authorId !== currentUserId) {
      throw new ForbiddenException('No puedes modificar este post');
    }

    // Si cambia el slug, valida colisión con otro post
    if (dto.slug && dto.slug !== existing.slug) {
      const other = await this.postRepo.findBySlug(dto.slug);
      if (other && other.id !== id) {
        throw new ConflictException('El slug ya está en uso');
      }
    }

    const data: UpdatePostData = { ...dto };
    return this.postRepo.update(id, data);
  }

  // ============== Publicación / Despublicación ==============
  async publish(id: string, currentUserId: number): Promise<DbPost> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('No puedes publicar este post');
    }
    if (post.status === PostStatus.PUBLISHED) {
      return post; // idempotencia
    }
    return this.postRepo.publish(id);
  }

  async unpublish(id: string, currentUserId: number): Promise<DbPost> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('No puedes despublicar este post');
    }
    if (post.status !== PostStatus.PUBLISHED) {
      return post; // idempotencia
    }
    return this.postRepo.unpublish(id);
  }

  // ============== Soft delete / Restore ==============
  async remove(id: string, currentUserId: number): Promise<void> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('No puedes eliminar este post');
    }
    await this.postRepo.softDelete(id, currentUserId);
  }

  async restore(id: string, currentUserId: number): Promise<DbPost> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundException('Post no encontrado');
    if (post.authorId !== currentUserId) {
      throw new ForbiddenException('No puedes restaurar este post');
    }
    return this.postRepo.restore(id);
  }

  // ============== Lecturas ==============
  async findById(id: string): Promise<PostResponseDto> {
    const post = await this.postRepo.findById(id);
    if (!post) throw new NotFoundException('Post no encontrado');

    return {
      ...post,
      category: post.category.name ?? null,
      tags: post.tags.map(tag => ({
        id: tag.id,
        name: tag.name
      })),
    };
  }

  async findBySlug(slug: string, increaseView = true): Promise<PostResponseDto> {
    const post = await this.postRepo.findBySlug(slug);
    if (!post) throw new NotFoundException('Post no encontrado');

    // (Opcional) incrementar vistas al leer por slug
    if (increaseView && post.visibility === PostVisibility.PUBLIC) {
      // No esperes el update si no te importa la latencia del response:
      // void this.postRepo.incrementViews(post.id, 1);
      await this.postRepo.incrementViews(post.id, 1);
    }

    return {
      ...post,
      category: post.category?.name ?? null,
      tags: post.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }

  // ============== Feed / Listados ==============
  async list(params?: PostListParams): Promise<PagedResult<PostResponseDto>> {
    // Atajo común: mostrar solo públicos publicados en el feed
    const merged: PostListParams = {
      publishedOnly: true,
      sortBy: 'publishedAt',
      order: 'desc',
      ...params,
    };
    const result = await this.postRepo.list(merged);

    return {
      ...result,
      items: result.items.map(post => ({
        ...post,
        category: post.category?.name ?? null,
        tags: post.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
        })),
      })),
    };
  }

  async listByAuthor(
    authorId: number,
    params?: Omit<PostListParams, 'authorId'>,
  ): Promise<PagedResult<PostResponseDto>> {
    const result = await this.postRepo.listByAuthor(authorId, params);

    return {
      ...result,
      items: result.items.map(post => ({
        ...post,
        category: post.category?.name ?? null,
        tags: post.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
        })),
      })),
    };
  }

  async listRelated(id: string, limit = 3): Promise<PostResponseDto[]> {
    const posts = await this.postRepo.listRelated(id, limit);

    return posts.map(post => ({
      ...post,
      category: post.category?.name ?? null,
      tags: post.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
      })),
    }));
  }

  // ============== Contadores (reacciones / comentarios) ==============
  async addReaction(id: string): Promise<void> {
    await this.ensurePostExists(id);
    await this.postRepo.incrementReactionsCount(id, 1);
  }

  async removeReaction(id: string): Promise<void> {
    await this.ensurePostExists(id);
    await this.postRepo.incrementReactionsCount(id, -1);
  }

  async onCommentCreated(id: string): Promise<void> {
    await this.ensurePostExists(id);
    await this.postRepo.incrementCommentsCount(id, 1);
  }

  async onCommentDeleted(id: string): Promise<void> {
    await this.ensurePostExists(id);
    await this.postRepo.incrementCommentsCount(id, -1);
  }

  // ============== Helper privado ==============
  private async ensurePostExists(id: string): Promise<void> {
    const exists = await this.postRepo.findById(id);
    if (!exists) throw new NotFoundException('Post no encontrado');
  }
}
