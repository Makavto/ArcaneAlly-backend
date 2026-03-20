import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { TokenType } from '../interfaces/token-types.enum';
import { UserType } from '../../../shared/types/user.type';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    this.authenticateClient(client);
    return true;
  }

  authenticateClient(client: Socket): UserType {
    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader || typeof authHeader !== 'string') {
        throw new UnauthorizedException('Пользователь не авторизован');
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Пользователь не авторизован');
      }

      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'SECRET',
      });
      if (payload.type !== TokenType.ACCESS) {
        throw new UnauthorizedException('Неверный тип токена');
      }

      return payload.user;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Неизвестная ошибка');
    }
  }
}
