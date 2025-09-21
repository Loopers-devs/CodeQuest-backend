import { Module } from '@nestjs/common';
import { PostFavoritesService } from './post-favorites.service';
import { PostFavoritesController } from './post-favorites.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaPostFavoritesRepository } from './repositories/prisma-post-favorites.repository';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [PrismaModule, PostsModule],
  controllers: [PostFavoritesController],
  providers: [
    {
      provide: 'PostFavoritesRepository',
      useClass: PrismaPostFavoritesRepository,
    },
    PostFavoritesService,
  ],
})
export class PostFavoritesModule {}
