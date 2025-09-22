import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsUUID } from 'class-validator';

export class PostFavorite {
  @IsInt()
  userId: number;

  @IsUUID()
  postId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt: Date | null;
}
