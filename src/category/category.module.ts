import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaCategoryRepository } from './repository/prisma-category.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'CategoryRepository',
      useClass: PrismaCategoryRepository,
    },
    CategoryService,
  ],
})
export class CategoryModule {}
