import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { SecurityConfig } from '../config/config.interface';
import { BcryptService } from '../shared/bcrypt/bcrypt.service';
import { LoginInput } from './dto/auth.dto';
import { Payload, Token } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
  ) {}

  async register({ username, password }: LoginInput): Promise<Token> {
    const hasPassword = await this.bcryptService.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: username,
          password: hasPassword,
          roles: 'USER',
        },
      });

      return this.generateTokens({
        sub: user.id,
        name: user.username,
        roles: user.roles,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException();
      } else {
        throw new Error(error);
      }
    }
  }

  async login({ username, password }: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordValid = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid Password');
    }

    return this.generateTokens({
      sub: user.id,
      name: user.username,
      roles: user.roles,
    });
  }

  generateTokens(payload: Payload): Token {
    return {
      access_token: this.generateAccessToken(payload),
      refresh_token: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: Payload): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { sub, name, roles } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({ sub, name, roles });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
