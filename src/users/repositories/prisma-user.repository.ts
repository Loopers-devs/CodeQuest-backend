import { ProviderType, RoleType, UserProvider } from 'src/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserRepository } from 'src/users/interfaces';
import { UserEntity } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
type DbUser = Prisma.UserGetPayload<{}>

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      nickname: user.nickname,
      email: user.email,
      password: user.password || null,
      roles: user.roles as Array<RoleType>,
      image: user.image || null,
      emailVerified: user.emailVerified || null,
      emailVerificationToken: user.emailVerificationToken || null,
      emailVerificationExpiry: user.emailVerificationExpiry || null,
      passwordResetToken: user.passwordResetToken || null,
      passwordResetTokenExpiry: user.passwordResetTokenExpiry || null,
      provider: user.providerType as UserProvider,
      providerAccountId: user.providerAccountId || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt || null,
    };
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      nickname: user.nickname,
      email: user.email,
      password: user.password || null,
      roles: user.roles as Array<RoleType>,
      image: user.image || null,
      emailVerified: user.emailVerified || null,
      emailVerificationToken: user.emailVerificationToken || null,
      emailVerificationExpiry: user.emailVerificationExpiry || null,
      passwordResetToken: user.passwordResetToken || null,
      passwordResetTokenExpiry: user.passwordResetTokenExpiry || null,
      provider: user.providerType as UserProvider,
      providerAccountId: user.providerAccountId || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt || null,
    };
  }

  async create(
    user: Pick<UserEntity, 'nickname' | 'fullName' | 'email' | 'password'>,
    provider?: ProviderType,

  ): Promise<UserEntity> {

    try {
      const created = await this.prismaService.user.create({
        data: {
          email: user.email,
          fullName: user.fullName,
          password: user.password ?? null,
          nickname: user.nickname ?? null,
          providerType: provider ?? 'CREDENTIALS'
        }
      });

      return this.toEntity(created)
    } catch (error) {
      throw error;
    }
  }


   toEntity(u: DbUser): UserEntity {
  return {
    id: u.id,
    fullName: u.fullName,
    nickname: u.nickname,
    email: u.email,
    password: u.password ?? null,
    roles: (u.roles as Array<RoleType>) ?? [],
    image: u.image ?? null,
    emailVerified: u.emailVerified ?? null,
    emailVerificationToken: u.emailVerificationToken ?? null,
    emailVerificationExpiry: u.emailVerificationExpiry ?? null,
    passwordResetToken: u.passwordResetToken ?? null,
    passwordResetTokenExpiry: u.passwordResetTokenExpiry ?? null,
    provider: u.providerType as UserProvider,
    providerAccountId: u.providerAccountId ?? null,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    deletedAt: u.deletedAt ?? null,
  };
}
}
