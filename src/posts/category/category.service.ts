import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { ICategoryRepository } from './interfaces';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.categoryRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description ?? undefined,
    });

    return newCategory;
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new BadRequestException('Categoría no encontrada');
    }

    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new BadRequestException('Categoría no encontrada');
    }

    return this.categoryRepository.update(id, updateDto);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new BadRequestException('Categoría no encontrada');
    }

    await this.categoryRepository.delete(id);
  }
}
