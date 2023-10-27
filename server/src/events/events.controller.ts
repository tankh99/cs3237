import { Controller, Get, Res } from '@nestjs/common';
import { EventsService } from './events.service';
import { SocketService } from 'src/socket/socket.service';
import { EventsGateway } from './events.gateway';

@Controller('events')
export class EventsController {
  connectionString: string;
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: EventsGateway,
    private socketService: SocketService,
  ) {}

  @Get()
  async getEvents() {
    return [];
  }

  @Get('test')
  async test() {
    console.log('Testing');
    // this.socketService.socket.emit('events', { name: 'FUCK' });
    this.eventsGateway.server.emit('events', { name: 'FUCK' });
  }
}