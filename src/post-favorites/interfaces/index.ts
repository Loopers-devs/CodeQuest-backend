export interface IPostFavoritesRepository {
  addFavorite(userId: number, postId: string): Promise<void>;
  removeFavorite(userId: number, postId: string): Promise<void>;
  isFavorite(userId: number, postId: string): Promise<boolean>;
  getFavoritesByUser(
    userId: number,
    opts?: { take?: number; cursor: string | null },
  ): Promise<{
    favorites: { userId: number; postId: string; createdAt: Date }[];
    nextCursor: string | null;
  }>;
}
