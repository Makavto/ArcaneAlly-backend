import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { TokenType } from '../interfaces/token-types.enum';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
      if (
        !req.headers['authorization'] ||
        typeof req.headers['authorization'] !== 'string'
      ) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      const authHeader = req.headers['authorization'];

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'SECRET',
      });
      if (payload.type !== TokenType.ACCESS) {
        throw new UnauthorizedException({
          message: 'Неверный тип токена',
        });
      }
      const user = payload.user;
      req.user = user;
      return true;
    } catch (e: unknown) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new Error('Неизвестная ошибка');
    }
  }
}
