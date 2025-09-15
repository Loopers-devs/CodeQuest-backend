import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
