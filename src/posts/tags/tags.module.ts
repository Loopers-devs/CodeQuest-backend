import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaTagRepository } from './repositories/prisma-tag.repository';

@Module({
  controllers: [TagsController],
  providers: [
    {
      provide: 'TagRepository',
      useClass: PrismaTagRepository,
    },
    TagsService,
  ],
})
export class TagsModule {}
