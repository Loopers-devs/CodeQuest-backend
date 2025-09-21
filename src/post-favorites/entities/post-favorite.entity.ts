import { IsInt, IsString, IsUUID } from 'class-validator';

export class PostFavorite {
  @IsInt()
  userId: number;

  @IsString()
  @IsUUID()
  postId: string;
  createdAt: Date;
}
