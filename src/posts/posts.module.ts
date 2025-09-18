import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaPostRepository } from './repositories/prisma-post.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PostsController],
  imports: [PrismaModule],
  providers: [
    {
      provide: 'PostRepository',
      useClass: PrismaPostRepository,
    },
    PostsService,
  ],
})
export class PostsModule {}
