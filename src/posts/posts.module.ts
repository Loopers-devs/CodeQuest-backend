import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaPostRepository } from './repositories/prisma-post.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TagsModule } from './tags/tags.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  exports: [PostsService],
  controllers: [PostsController],
  imports: [PrismaModule, CategoryModule, TagsModule],
  providers: [
    {
      provide: 'PostRepository',
      useClass: PrismaPostRepository,
    },
    PostsService,
  ],
})
export class PostsModule {}
