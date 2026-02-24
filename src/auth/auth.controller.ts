import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiResponse({ status: 403, description: 'Недействительный или истёкший refresh-токен' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  async refresh(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Выход — инвалидация refresh-токена' })
  @ApiResponse({ status: 201, description: 'Выход выполнен' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  async logout(@Body() dto: RefreshTokenRequestDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
