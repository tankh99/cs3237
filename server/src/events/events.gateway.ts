import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import http from 'http';

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;
  wsClients = [];

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(client, payload);
    const data = 'Hello world';
    this.broadcast(data);
    return data;
  }

  handleConnection(client: WebSocket) {
    console.log('Client connected', client);
    this.wsClients.push(client);
    // You can handle client connections here.
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected', client);
    this.wsClients = this.wsClients.filter((c) => c != client);
    // You can handle client disconnections here.
  }

  broadcast(data: any) {
    // const client1 = new WebSocket('http://localhost:4000');

    const client1 = new WebSocket.Server({
      server: http.createServer().listen(4001),
    });
    console.log(client1.readyState, WebSocket.OPEN);
    this.wsClients.push(client1);
    this.wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          console.log(`Broadcasting data ${data}`);
          client.send(data);
          client.emit('message', data);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}
