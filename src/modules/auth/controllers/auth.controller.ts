import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { TokensResponseDto } from '../dto/tokens-response.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/auth-roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: RegisterResponseDto,
  })
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход по email и паролю' })
  @ApiResponse({
    status: 201,
    description: 'Успешный вход, возвращает access и refresh токены',
    type: TokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление пары токенов по refresh-токену' })
  @ApiResponse({
    status: 201,
    description: 'Новая пара access и refresh токенов',
    type: TokensResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Недействительный или истёкший refresh-токен',
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiBearerAuth()
  @Roles(Role.PLAYER)
  @UseGuards(AuthGuard)
  async refresh(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Выход — инвалидация refresh-токена' })
  @ApiResponse({ status: 201, description: 'Выход выполнен' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiBearerAuth()
  @Roles(Role.PLAYER)
  @UseGuards(AuthGuard)
  async logout(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
