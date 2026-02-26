import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

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

  @ApiProperty({
    description: 'Роль пользователя',
    example: Role.PLAYER,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
