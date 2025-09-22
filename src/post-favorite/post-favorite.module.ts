import { Module } from '@nestjs/common';
import { PostFavoriteService } from './post-favorite.service';
import { PostFavoriteController } from './post-favorite.controller';
import { PrismaPostFavoriteRepository } from './repository/prisma-postFavorite.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostFavoriteController],
  providers: [
    {
      provide: 'PostFavoriteRepository',
      useClass: PrismaPostFavoriteRepository,
    },
    PostFavoriteService,
  ],
})
export class PostFavoriteModule {}
