import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CampaignsService } from '../services/campaigns.service';
import { CampaignResponseDto } from '../dto/campaign-response.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request.type';
import { PaginationResponse } from 'src/shared/decorators/pagination-response.decorator';
import { PaginationRequestDto } from 'src/shared/dtos/pagination-request.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';

@ApiTags('Кампании')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание кампании' })
  @ApiResponse({
    status: 201,
    description: 'Кампания успешно создана',
    type: CampaignResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async create(
    @Body() dto: CreateCampaignDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.campaignsService.create(dto, req.user.id);
  }

  @Get('gm')
  @ApiOperation({
    summary: 'Получение кампаний пользователя, которые он ведет',
  })
  @PaginationResponse(CampaignResponseDto, {
    description: 'Кампании успешно получены',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUserCampaigns(
    @Req() req: AuthenticatedRequest,
    @Query() query: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CampaignResponseDto>> {
    return this.campaignsService.getUserGMCampaigns(
      req.user.id,
      Number(query.page) || 1,
      Number(query.limit) || 10,
    );
  }

  @Get('player')
  @ApiOperation({
    summary:
      'Получение кампаний пользователя, в которых он участвует как игрок',
  })
  @PaginationResponse(CampaignResponseDto, {
    description: 'Кампании успешно получены',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUserPlayerCampaigns(
    @Req() req: AuthenticatedRequest,
    @Query() query: PaginationRequestDto,
  ): Promise<PaginationResponseDto<CampaignResponseDto>> {
    return this.campaignsService.getUserPlayerCampaigns(
      req.user.id,
      Number(query.page) || 1,
      Number(query.limit) || 10,
    );
  }
}
