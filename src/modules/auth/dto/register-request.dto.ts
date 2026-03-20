import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'password123' })
  @MinLength(6)
  password: string;
}
