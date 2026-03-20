import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsGateway } from './campaigns.gateway';
import { WsAuthGuard } from '../../auth/guards/ws-auth.guard';

describe('CampaignsGateway', () => {
  let gateway: CampaignsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsGateway,
        {
          provide: WsAuthGuard,
          useValue: {
            authenticateClient: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<CampaignsGateway>(CampaignsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
