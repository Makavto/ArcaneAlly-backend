import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ description: 'Название кампании', example: 'My Campaign' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Описание кампании',
    example: 'My Campaign Description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
