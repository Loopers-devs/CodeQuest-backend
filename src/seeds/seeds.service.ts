import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class SeedsService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateRandomData() {
    //Delete existing data
    await this.prismaService.post.deleteMany({});
    await this.prismaService.user.deleteMany({});

    // Users
    const users: Prisma.UserCreateInput[] = Array.from({ length: 10 }).map(
      () => ({
        fullName: faker.person.fullName(),
        password: bcryptjs.hashSync('password123', 10),
        nickname: faker.internet.username(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
        providerType: 'CREDENTIALS',
      }),
    );

    const defaultUser: Prisma.UserCreateInput = {
      fullName: 'Admin User',
      password: bcryptjs.hashSync('admin123', 10),
      nickname: 'admin',
      email: 'admin@example.com',
      image: faker.image.avatar(),
      providerType: 'CREDENTIALS',
    };

    await this.prismaService.user.createMany({ data: [...users, defaultUser] });

    // Posts
    const allUsers = await this.prismaService.user.findMany();

    const posts: Prisma.PostCreateManyInput[] = Array.from({ length: 50 }).map(
      () => ({
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        summary: faker.lorem.paragraph(),
        content: faker.lorem.paragraphs(5),
        coverImageUrl: faker.image.urlPicsumPhotos({
          width: 800,
          height: 600,
          blur: 0,
        }),
        category: faker.helpers.arrayElement([
          'Technology',
          'Health',
          'Travel',
          'Food',
          'Science',
          'Art',
        ]),
        status: faker.helpers.arrayElement(['DRAFT', 'PUBLISHED']),
        visibility: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
        authorId: faker.helpers.arrayElement(allUsers).id,
        tags: faker.helpers.arrayElements(
          ['tech', 'life', 'travel', 'food', 'health', 'science', 'art'],
          { min: 1, max: 3 },
        ),
        publishedAt: faker.date.past(),
      }),
    );

    await this.prismaService.post.createMany({ data: posts });
  }
}
