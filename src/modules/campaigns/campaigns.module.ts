import { Module } from '@nestjs/common';
import { CampaignsController } from './controllers/campaigns.controller';
import { CampaignsService } from './services/campaigns.service';
import { AuthModule } from '../auth/auth.module';
import { CampaignsGateway } from './gateways/campaigns.gateway';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsGateway],
  imports: [AuthModule],
})
export class CampaignsModule {}
