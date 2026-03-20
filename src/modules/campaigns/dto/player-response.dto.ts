import { CampaignPlayer, User } from '@prisma/client';
import { CharacterType } from 'src/shared/types/character.type';

export class PlayerResponseDto implements CharacterType {
  id: number;
  characterName: string;
  userName: string;

  constructor(player: CampaignPlayer & { user: User }) {
    this.id = player.id;
    this.characterName = player.characterName;
    this.userName = player.user.name;
  }
}
