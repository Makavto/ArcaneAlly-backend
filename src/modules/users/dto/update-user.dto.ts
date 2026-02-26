import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя', example: 'John Doe' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;
}
