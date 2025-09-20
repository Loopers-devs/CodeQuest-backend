import { Controller, Get, Header } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Seed the database with random data' })
  async seedDatabase() {
    await this.seedsService.generateRandomData();

    return { message: 'Database seeded successfully' };
  }
}
