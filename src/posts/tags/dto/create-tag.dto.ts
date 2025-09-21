import { PickType } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';

export class CreateTagDto extends PickType(Tag, [
  'name',
  'description',
] as const) {}
