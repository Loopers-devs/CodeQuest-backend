import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { SocialLoginDto } from './dto/social-login.dto';
import {
  clearAuthCookies,
  saveAuthCookie,
  setAuthCookie,
} from 'src/utils/auth-cookie';
import { envs } from 'src/config/envs.config';
import { RegisterDto } from './dto/register.dto';
import { DiscordAuthGuard } from './guard/discord-auth.guard';
import { DiscordProfile, GoogleProfile } from 'src/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.login(loginDto);
    const refreshToken = this.authService.generateRefreshToken({
      email: loginDto.email,
    });

    await saveAuthCookie(res, accessToken, refreshToken);

    return { message: 'Inicio de sesión exitoso' };
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.register(registerDto);
    const refreshToken = this.authService.generateRefreshToken({
      email: registerDto.email,
    });

    await saveAuthCookie(res, accessToken, refreshToken);

    return { message: 'Registro exitoso' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const cookies = req.cookies as Record<string, string>;

      if (!cookies || !cookies.refresh) {
        await clearAuthCookies(res);
        throw new UnauthorizedException(
          'Session caducada, por favor inicie sesión nuevamente',
        );
      }

      const accessToken = await this.authService.refreshToken(cookies.refresh);

      setAuthCookie({
        res,
        name_cookie: 'access',
        value: accessToken,
        timeout: 60 * 60 * 24,
      });
      return { message: 'Token de acceso actualizado exitosamente' };
    } catch {
      await clearAuthCookies(res);
      throw new UnauthorizedException(
        'Session caducada, por favor inicie sesión nuevamente',
      );
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as unknown as GoogleProfile;

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('No se pudo autenticar al usuario');
    }

    const socialLoginDto: SocialLoginDto = {
      userId: user.id,
      nickname: user.name.givenName,
      email: user.emails[0].value,
      fullName: user.displayName,
      picture: user.photos[0]?.value || null,
      provider: 'GOOGLE',
    };

    const accessToken = await this.authService.socialLogin(socialLoginDto);
    const refreshToken = this.authService.generateRefreshToken({
      email: user.emails[0].value,
    });

    await saveAuthCookie(res, accessToken, refreshToken);

    return res.redirect(envs.urlFrontend);
  }

  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  async discordAuth() {}

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  async discordAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as unknown as DiscordProfile;

    if (!user) {
      throw new UnauthorizedException('No se pudo autenticar al usuario');
    }

    const accessToken = await this.authService.socialLogin({
      userId: user.id,
      email: user.email,
      fullName: user.global_name,
      picture: user.avatar,
      provider: 'DISCORD',
      nickname: user.username,
    });

    const refreshToken = this.authService.generateRefreshToken({
      email: user.email,
    });

    await saveAuthCookie(res, accessToken, refreshToken);

    return res.redirect(envs.urlFrontend);
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await clearAuthCookies(res);
    return { message: 'Sesión cerrada exitosamente' };
  }
}
