import { Module } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PostCommentsController } from './post-comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsModule } from 'src/posts/posts.module';
import { PrismaCommentRepository } from './repository/prisma-comment.repository';

@Module({
  imports: [PrismaModule, PostsModule],
  controllers: [PostCommentsController],
  providers: [
    {
      provide: 'CommentRepository',
      useClass: PrismaCommentRepository,
    },
    PostCommentsService,
  ],
})
export class PostCommentsModule {}
