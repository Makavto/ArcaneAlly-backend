import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from '../../auth/guards/ws-auth.guard';
import { AuthenticatedSocket } from '../../../shared/types/authenticated-socket.type';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'campaigns',
})
export class CampaignsGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private readonly wsAuthGuard: WsAuthGuard) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.use((socket: AuthenticatedSocket, next) => {
      try {
        const user = this.wsAuthGuard.authenticateClient(socket);
        socket.user = user;
        next();
      } catch (error: unknown) {
        if (error instanceof UnauthorizedException) {
          next(error);
        }
        next(new Error('Неизвестная ошибка'));
      }
    });

    console.log('WebSocket server initialized');
  }

  handleConnection(socket: AuthenticatedSocket): void {
    const user = socket.user;
    console.log(`Campaigns socket connected: ${user?.id ?? 'unknown'}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, payload: any): void {
    console.log(client.user);
    console.log(`Campaigns socket message: ${payload}`);
  }
}
