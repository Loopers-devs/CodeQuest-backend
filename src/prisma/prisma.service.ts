import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name, { timestamp: true });

  async onModuleInit() {
    await this.$connect().then(() => {
      this.logger.log('Connect to the database successfully');
    });
  }
}
