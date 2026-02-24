import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './auth-roles.decorator';
import { Role } from '@prisma/client';
import { TokenPayload } from './interfaces/token-payload.interface';
import { TokenType } from './interfaces/token-types.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
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
      return requiredRoles.includes(user.role);
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('Нет доступа');
    }
  }
}
