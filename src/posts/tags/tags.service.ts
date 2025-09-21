import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import type { ITagRepository } from './interfaces';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @Inject('TagRepository')
    private readonly tagRepository: ITagRepository,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existing = await this.tagRepository.findByName(createTagDto.name);

    if (existing) {
      throw new BadRequestException('Ya existe un tag con ese nombre');
    }

    const newTag = await this.tagRepository.create({
      name: createTagDto.name,
      description: createTagDto.description ?? undefined,
    });

    return newTag;
  }

  async findById(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new BadRequestException('Tag no encontrado');
    }

    return tag;
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }

  async update(id: string, updateDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new BadRequestException('Tag no encontrado');
    }

    return this.tagRepository.update(id, updateDto);
  }

  async delete(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new BadRequestException('Tag no encontrado');
    }

    await this.tagRepository.delete(id);
  }
}
