import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Общее количество элементов', example: 100 })
  total: number;
  @ApiProperty({ description: 'Номер страницы', example: 1 })
  page: number;
  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  limit: number;
  @ApiProperty({
    description: 'Данные',
    example: [{ id: 1, name: 'John Doe' }],
  })
  data: T[];

  constructor(total: number, page: number, limit: number, data: T[]) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
