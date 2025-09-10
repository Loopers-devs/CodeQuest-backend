import * as bcryptjs from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { SocialLoginDto } from './dto/social-login.dto';
import { envs } from 'src/config/envs.config';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.password === null || !loginDto.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new UnauthorizedException('Usuario ya existe');
    }

    if (!registerDto.password) {
      throw new UnauthorizedException('Contraseña es requerida');
    }

    const newUser = await this.userService.create(
      {
        email: registerDto.email,
        fullName: registerDto.fullName,
        password: registerDto.password,
      },
      'CREDENTIALS',
    );

    const payload = { email: newUser.email, sub: newUser.id };
    return this.jwtService.sign(payload);
  }

  async socialLogin(user: SocialLoginDto) {
    const existingUser = await this.userService.findByEmail(user.email);

    if (existingUser) {
      const payload = { email: existingUser.email, sub: existingUser.id };
      return this.jwtService.sign(payload);
    }

    const newUser = await this.userService.create(
      {
        email: user.email,
        fullName: user.fullName,
        password: null,
      },
      user.provider,
    );

    const payload = { email: newUser.email, sub: newUser.id };
    return this.jwtService.sign(payload);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<{ email: string; sub: string }>(
        token,
        {
          secret: envs.jwtRefreshSecret,
        },
      );

      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPayload = { email: user.email, sub: user.id };
      return this.jwtService.sign(newPayload);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: envs.jwtRefreshExpiresIn,
      secret: envs.jwtRefreshSecret,
    });
  }
}
