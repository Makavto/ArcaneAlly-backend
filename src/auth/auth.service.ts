import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { User } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { TokenType } from './interfaces/token-types.enum';

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function expiresInToSeconds(exp: string): number {
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) return 900;
  const n = parseInt(match[1], 10);
  const mult: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return n * (mult[match[2]] ?? 60);
}

function expiresInToMs(exp: string): number {
  return expiresInToSeconds(exp) * 1000;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(dto: LoginRequestDto): Promise<TokensResponseDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    return this.issueTokenPair(user);
  }

  async refresh(refreshToken: string): Promise<TokensResponseDto> {
    let payload: TokenPayload;
    try {
      payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'SECRET',
      });
    } catch {
      throw new ForbiddenException(
        'Недействительный или истёкший refresh-токен',
      );
    }
    if (payload.type !== TokenType.REFRESH) {
      throw new ForbiddenException('Неверный тип токена');
    }
    const hash = this.hashRefreshToken(refreshToken);
    const session = await this.prisma.session.findFirst({
      where: { userId: payload.user.id, refreshTokenHash: hash },
    });
    if (!session) {
      throw new ForbiddenException('Сессия не найдена или отозвана');
    }
    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new ForbiddenException('Refresh-токен истёк');
    }
    const user = await this.userService.findById(payload.user.id);
    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }
    // Ротация: удаляем старую сессию, создаём новую
    await this.prisma.session.delete({ where: { id: session.id } });
    return this.issueTokenPair(user);
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    const hash = this.hashRefreshToken(refreshToken);
    await this.prisma.session.deleteMany({
      where: { refreshTokenHash: hash },
    });
    return { message: 'Выход выполнен' };
  }

  private async issueTokenPair(user: User): Promise<TokensResponseDto> {
    const userPayload = new UserResponseDto(user);
    const accessPayload: TokenPayload = {
      type: TokenType.ACCESS,
      user: userPayload,
    };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: ACCESS_EXPIRES_IN,
      secret: process.env.JWT_ACCESS_SECRET || 'SECRET',
    });
    const refreshPayload: TokenPayload = {
      type: TokenType.REFRESH,
      user: userPayload,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: REFRESH_EXPIRES_IN,
      secret: process.env.JWT_REFRESH_SECRET || 'SECRET',
    });
    const refreshExpiresAt = new Date(
      Date.now() + expiresInToMs(REFRESH_EXPIRES_IN),
    );
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: refreshExpiresAt,
      },
    });
    return new TokensResponseDto(accessToken, refreshToken);
  }

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
