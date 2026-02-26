import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { TokensResponseDto } from './tokens-response.dto';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Access-токен для доступа к защищённым эндпоинтам',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh-токен для обновления access-токена',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Пользователь',
    example: { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  })
  user: UserResponseDto;

  constructor(tokens: TokensResponseDto, user: UserResponseDto) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.user = user;
  }
}
