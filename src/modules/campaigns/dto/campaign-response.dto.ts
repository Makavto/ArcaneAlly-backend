import { Campaign, CampaignPlayer, User } from '@prisma/client';
import { PlayerResponseDto } from './player-response.dto';

export class CampaignResponseDto {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  invitationCode: string;
  gmId: number;
  players: PlayerResponseDto[];

  constructor(
    campaign: Campaign & { players: (CampaignPlayer & { user: User })[] },
  ) {
    this.id = campaign.id;
    this.name = campaign.name;
    this.description = campaign.description;
    this.isActive = campaign.isActive;
    this.invitationCode = campaign.invitationCode;
    this.gmId = campaign.gmId;
    this.players = campaign.players.map(
      (player) => new PlayerResponseDto(player),
    );
  }
}
