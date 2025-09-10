// import { Injectable } from '@nestjs/common';
// import { IUserRepository } from '../interfaces';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { UserEntity, UserProviderEntity } from '../entities/user.entity';

// @Injectable()
// export class UserRepository implements IUserRepository {
//   constructor(private readonly prismaService: PrismaService) {}

//   async findAll(): Promise<UserEntity[]> {
//     const users = await this.prismaService.user.findMany();

//     return users.map((user) =>
//       UserEntity.from({
//         id: user.id,
//         roles: user.roles,
//         name: user.name,
//         email: user.email,
//         password: user.password,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       }),
//     );
//   }

//   async findByEmail(email: string): Promise<UserEntity | null> {
//     const user = await this.prismaService.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       return null;
//     }

//     return UserEntity.from({
//       id: user.id,
//       roles: user.roles,
//       name: user.name,
//       email: user.email,
//       password: user.password,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     });
//   }

//   async findById(id: number): Promise<UserEntity | null> {
//     const user = await this.prismaService.user.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!user) {
//       return null;
//     }

//     return UserEntity.from({
//       id: user.id,
//       roles: user.roles,
//       name: user.name,
//       email: user.email,
//       password: user.password,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     });
//   }
//   async create(
//     user: Pick<UserEntity, 'name' | 'email' | 'password'>,
//     provider?: Pick<UserProviderEntity, 'provider' | 'providerAccountId'>,
//   ): Promise<UserEntity> {
//     const newUser = await this.prismaService.user.create({
//       data: {
//         name: user.name,
//         email: user.email,
//         password: user.password,
//         Account: {
//           create: provider
//             ? {
//                 provider: provider.provider,
//                 providerAccountId: provider.providerAccountId,
//               }
//             : undefined,
//         },
//       },
//     });

//     return UserEntity.from({
//       id: newUser.id,
//       roles: newUser.roles,
//       name: newUser.name,
//       email: newUser.email,
//       password: newUser.password,
//       createdAt: newUser.createdAt,
//       updatedAt: newUser.updatedAt,
//     });
//   }
// }
