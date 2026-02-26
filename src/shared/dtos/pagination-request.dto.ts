import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty({ description: 'Номер страницы', example: 1 })
  @IsNotEmpty()
  @IsNumberString()
  page: string;

  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  @IsNotEmpty()
  @IsNumberString()
  limit: string;
}
