import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  public server: Server;
  wsClients = [];

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  @SubscribeMessage(process.env.EVENTS_SERVER)
  handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    console.log('Broadcasting payload', payload);
    // client.broadcast.emit(JSON.stringify(payload));
    // client.broadcast.emit(JSON.stringify(payload));
    // client.emit('events-output', JSON.stringify(payload));
    client.emit(process.env.EVENTS_CLIENT, JSON.stringify(payload));
  }

  handleConnection(client: Socket) {
    if (!this.wsClients.includes(client.conn.remoteAddress)) {
      console.log('Client connected', client.conn.remoteAddress);
      this.wsClients.push(client.conn.remoteAddress);
    }
    // You can handle client connections here.
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    this.wsClients = this.wsClients.filter((c) => c != client);
    // You can handle client disconnections here.
  }
}
