import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { CampaignResponseDto } from '../dto/campaign-response.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCampaignDto, userId: number) {
    const campaign = await this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        gmId: userId,
      },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });
    return new CampaignResponseDto(campaign);
  }

  async getUserGMCampaigns(userId: number, page: number, limit: number) {
    const campaigns = await this.prisma.campaign.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        gmId: userId,
      },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });
    const total = await this.prisma.campaign.count({
      where: {
        gmId: userId,
      },
    });
    return new PaginationResponseDto(
      total,
      page,
      limit,
      campaigns.map((campaign) => new CampaignResponseDto(campaign)),
    );
  }

  async getUserPlayerCampaigns(userId: number, page: number, limit: number) {
    const campaigns = await this.prisma.campaign.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        players: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });

    const total = await this.prisma.campaign.count({
      where: {
        players: {
          some: {
            userId: userId,
          },
        },
      },
    });
    return new PaginationResponseDto(
      total,
      page,
      limit,
      campaigns.map((campaign) => new CampaignResponseDto(campaign)),
    );
  }
}
