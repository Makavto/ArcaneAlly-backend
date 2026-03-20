import { Module } from '@nestjs/common';
import { CampaignsController } from './controllers/campaigns.controller';
import { CampaignsService } from './services/campaigns.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService],
  imports: [AuthModule],
})
export class CampaignsModule {}
