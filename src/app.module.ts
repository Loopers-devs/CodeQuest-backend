import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { SeedsModule } from './seeds/seeds.module';
import { PostFavoritesModule } from './post-favorites/post-favorites.module';
import { PostFavoriteModule } from './post-favorite/post-favorite.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    PostsModule,
    SeedsModule,
    PostFavoritesModule,
    PostFavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
