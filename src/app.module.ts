import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { SeedsModule } from './seeds/seeds.module';
import { PostFavoritesModule } from './post-favorites/post-favorites.module';
import { LikePostModule } from './like-post/like-post.module';
import { PostCommentsModule } from './post-comments/post-comments.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    PostsModule,
    SeedsModule,
    PostFavoritesModule,
    LikePostModule,
    PostCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
