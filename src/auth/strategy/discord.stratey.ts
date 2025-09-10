import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-discord';
import { VerifiedCallback } from 'passport-jwt';
import { envs } from 'src/config/envs.config';
import { DiscordProfile } from 'src/interfaces';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super({
      clientID: envs.discordClientId,
      clientSecret: envs.discordClientSecret,
      callbackURL: envs.discordRedirectUri,
      scope: ['identify', 'email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: DiscordProfile,
    done: VerifiedCallback,
  ) {
    return done(null, profile);
  }
}
