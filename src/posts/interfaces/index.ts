import { Prisma } from '@prisma/client';
import { PostStatus, PostVisibility } from 'src/interfaces';
import { PostEntity } from '../entities/post.entity';

export type DbPost = Prisma.PostGetPayload<{}>;

// -------- Tipos de apoyo ----------
export type PostSortBy =
  | 'publishedAt'
  | 'createdAt'
  | 'views'
  | 'reactionsCount'
  | 'commentsCount';

export type SortOrder = 'asc' | 'desc';

export interface PostListParams {
  // Filtros
  search?: string; // título/contenido/slug
  authorId?: number;
  category?: string | null;
  tags?: string[]; // match ANY o ALL (a elección en la impl.)
  status?: PostStatus;
  visibility?: PostVisibility;
  publishedOnly?: boolean; // atajo: status=PUBLISHED + visibility=PUBLIC
  dateFrom?: Date; // por rango de fechas
  dateTo?: Date;
  excludeDeleted?: boolean; // default: true

  // Orden y paginación
  sortBy?: PostSortBy; // default: publishedAt
  order?: SortOrder; // default: desc
  cursor?: string; // id o publishedAt-id encodeado
  take?: number; // page size (default: 10-20)
}

export type CreatePostData = Pick<
  PostEntity,
  | 'title'
  | 'slug'
  | 'summary'
  | 'content'
  | 'category'
  | 'tags'
  | 'status'
  | 'visibility'
  | 'coverImageUrl'
> & { authorId: number };

export type UpdatePostData = Partial<
  Pick<
    PostEntity,
    | 'title'
    | 'slug'
    | 'summary'
    | 'content'
    | 'category'
    | 'tags'
    | 'status'
    | 'visibility'
    | 'coverImageUrl'
    | 'publishedAt'
  >
>;

export interface PagedResult<T> {
  items: T[];
  nextCursor?: string | null;
  total?: number; // opcional (si haces count)
}

// -------- Contrato del repositorio ----------
export interface IPostRepository {
  // Lecturas básicas
  findById(id: string): Promise<DbPost | null>;
  findBySlug(slug: string): Promise<DbPost | null>;
  existsBySlug(slug: string): Promise<boolean>;

  // Listado / feed (búsqueda, filtros, orden, paginación por cursor)
  list(params?: PostListParams): Promise<PagedResult<DbPost>>;
  listByAuthor(
    authorId: number,
    params?: Omit<PostListParams, 'authorId'>,
  ): Promise<PagedResult<DbPost>>;
  listRelated(id: string, limit?: number): Promise<DbPost[]>; // por tags/category

  // Escrituras
  create(data: CreatePostData): Promise<DbPost>;
  update(id: string, data: UpdatePostData): Promise<DbPost>;
  updateBySlug(slug: string, data: UpdatePostData): Promise<DbPost>;

  // Ciclo de publicación
  publish(id: string): Promise<DbPost>; // status=PUBLISHED, publishedAt=now (si no existe)
  unpublish(id: string): Promise<DbPost>; // status=DRAFT (o el que uses), publishedAt=null

  // Borrado lógico y restauración
  softDelete(id: string, deletedBy: number): Promise<void>;
  restore(id: string): Promise<DbPost>;

  // Contadores atómicos (para vistas, reacciones y comentarios)
  incrementViews(id: string, by?: number): Promise<void>; // default by=1
  incrementCommentsCount(id: string, by: number): Promise<void>; // +1/-1 al crear/eliminar comentario
  incrementReactionsCount(id: string, by: number): Promise<void>; // +1/-1

  // (Opcional) utilidades de tags/cover si quieres métodos explícitos
  // setTags(id: string, tags: string[]): Promise<DbPost>;
  // setCoverImageUrl(id: string, url: string | null): Promise<DbPost>;
}
