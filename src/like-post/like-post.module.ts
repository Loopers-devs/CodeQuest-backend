import { Module } from '@nestjs/common';
import { LikePostService } from './like-post.service';
import { LikePostController } from './like-post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaLikePostRepository } from './repositories/prisma-like.repository';

@Module({
  imports:[PrismaModule],
  controllers: [LikePostController],
  providers: [
    {
      provide: 'LikePostRepository',
      useClass: PrismaLikePostRepository,
    },
    LikePostService,
  ],
})
export class LikePostModule {}
