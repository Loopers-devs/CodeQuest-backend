import { ProviderType, RoleType, UserProvider } from 'src/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserRepository } from 'src/users/interfaces';
import { UserEntity } from '../entities/user.entity';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

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

  create(
    user: Pick<UserEntity, 'nickname' | 'fullName' | 'email' | 'password'>,
    provider?: ProviderType,
  ): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
