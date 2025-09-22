import { PartialType, PickType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-post-comment.dto';

export class UpdatePostCommentDto extends PartialType(
  PickType(CreateCommentDto, ['content'] as const),
) {}
