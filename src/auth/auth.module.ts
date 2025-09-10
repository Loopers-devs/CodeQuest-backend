import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { UsersModule } from 'src/users/users.module';
import { envs } from 'src/config/envs.config';
import { DiscordStrategy } from './strategy/discord.stratey';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: envs.jwtExpiresIn },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, DiscordStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
