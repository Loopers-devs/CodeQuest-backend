import { Injectable } from '@nestjs/common';
/* import { faker } from '@faker-js/faker'; */
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import { Post, PostComment, ProviderType } from '@prisma/client';

async function getFaker() {
  const { faker } = await import('@faker-js/faker');
  return faker;
}

@Injectable()
export class SeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateRandomData() {
    const faker = await getFaker();
    // 🔄 Limpiar datos existentes (orden seguro por FKs)
    await this.prisma.postLike.deleteMany({});
    await this.prisma.postFavorite.deleteMany({});
    await this.prisma.postComment.deleteMany({});
    await this.prisma.post.deleteMany({});
    await this.prisma.tags.deleteMany({});
    await this.prisma.category.deleteMany({});
    await this.prisma.user.deleteMany({});

    // 👤 Usuarios
    const users = Array.from({ length: 10 }).map(() => ({
      fullName: faker.person.fullName(),
      password: bcryptjs.hashSync('password123', 10),
      nickname: faker.internet.username(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      providerType: ProviderType.CREDENTIALS,
    }));

    const defaultUser = {
      fullName: 'Admin User',
      password: bcryptjs.hashSync('admin123', 10),
      nickname: 'admin',
      email: 'admin@example.com',
      image: faker.image.avatar(),
      providerType: ProviderType.CREDENTIALS,
    };

    await this.prisma.user.createMany({ data: [...users, defaultUser] });
    const allUsers = await this.prisma.user.findMany();

    // 🗂️ Categorías
    const categoryNames = [
      'Technology',
      'Health',
      'Travel',
      'Food',
      'Science',
      'Art',
    ];
    const categories = await Promise.all(
      categoryNames.map((name) =>
        this.prisma.category.create({
          data: {
            name,
            description: `Categoría sobre ${name.toLowerCase()}`,
          },
        }),
      ),
    );

    // 🏷️ Tags
    const tagNames = [
      'tech',
      'life',
      'travel',
      'food',
      'health',
      'science',
      'art',
    ];
    const tags = await Promise.all(
      tagNames.map((name) =>
        this.prisma.tags.create({
          data: {
            name,
            description: `Etiqueta para ${name}`,
          },
        }),
      ),
    );

    // 📝 Posts
    const posts: Post[] = [];
    for (let i = 0; i < 50; i++) {
      const author = faker.helpers.arrayElement(allUsers);
      const category = faker.helpers.arrayElement(categories);
      const selectedTags = faker.helpers.arrayElements(tags, {
        min: 1,
        max: 3,
      });

      const post = await this.prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          slug:
            faker.lorem.slug() +
            '-' +
            faker.string.alphanumeric(6).toLowerCase(),
          summary: faker.lorem.paragraph(),
          content: faker.lorem.paragraphs(3),
          coverImageUrl: faker.image.urlPicsumPhotos({
            width: 800,
            height: 600,
          }),
          categoryId: category.id,
          status: faker.helpers.arrayElement(['DRAFT', 'PUBLISHED']),
          visibility: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE']),
          authorId: author.id,
          publishedAt: faker.date.past(),
          tags: { connect: selectedTags.map((t) => ({ id: t.id })) },
        },
      });

      posts.push(post);
    }

    // 💬 PostComments (2 niveles: top-level + replies)
    const MAX_TOP_LEVEL = { min: 2, max: 6 };
    const MAX_REPLIES_PER_TOP = { min: 0, max: 5 };

    for (const post of posts) {
      const topLevelCount = faker.number.int(MAX_TOP_LEVEL);

      const topLevelComments: PostComment[] = [];
      for (let i = 0; i < topLevelCount; i++) {
        const author = faker.helpers.arrayElement(allUsers);
        const content = faker.lorem.sentences(
          faker.number.int({ min: 1, max: 3 }),
        );
        const created = await this.prisma.$transaction(async (tx) => {
          const c = await tx.postComment.create({
            data: {
              postId: post.id,
              authorId: author.id,
              content,
              parentId: null,
              createdAt: faker.date.recent({ days: 60 }),
            },
          });
          await tx.post.update({
            where: { id: post.id },
            data: { commentsCount: { increment: 1 } },
          });
          return c;
        });
        topLevelComments.push(created);
      }

      for (const parent of topLevelComments) {
        const repliesCount = faker.number.int(MAX_REPLIES_PER_TOP);
        for (let r = 0; r < repliesCount; r++) {
          const author = faker.helpers.arrayElement(allUsers);
          const content = faker.lorem.sentences(
            faker.number.int({ min: 1, max: 2 }),
          );
          await this.prisma.$transaction(async (tx) => {
            await tx.postComment.create({
              data: {
                postId: post.id,
                authorId: author.id,
                content,
                parentId: parent.id,
                createdAt: faker.date.recent({ days: 45 }),
              },
            });
            await tx.post.update({
              where: { id: post.id },
              data: { commentsCount: { increment: 1 } },
            });
          });
        }
      }
    }

    console.log(
      '✅ Datos de prueba generados correctamente con postComments y respuestas',
    );
  }
}
