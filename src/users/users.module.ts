import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongoUserRepository } from './repositories/mongo-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: MongoUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
