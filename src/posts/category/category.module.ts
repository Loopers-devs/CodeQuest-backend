import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaCategoryRepository } from './repository/prisma-category.repository';

@Module({
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
