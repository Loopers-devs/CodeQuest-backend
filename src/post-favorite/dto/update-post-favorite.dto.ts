import { PartialType } from '@nestjs/swagger';
import { CreatePostFavoriteDto } from './create-post-favorite.dto';

export class UpdatePostFavoriteDto extends PartialType(CreatePostFavoriteDto) {}
