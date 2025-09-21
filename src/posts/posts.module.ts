import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaPostRepository } from './repositories/prisma-post.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { TagsModule } from './tags/tags.module';

@Module({
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
