import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { EventsService } from './events.service';
import { SocketService } from 'src/socket/socket.service';
import { EventsGateway } from './events.gateway';
import { IothubService } from 'src/iothub/iothub.service';

@Controller('events')
export class EventsController {
  connectionString: string;
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: EventsGateway,
    private readonly iotHubService: IothubService,
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

  @Post()
  async createEvents(@Body() body) {
    this.eventsService.createEvents(body);
    return 'Dumbo';
  }

  @Post('/send')
  async sendMessage(@Body() body, @Res() res) {
    const response = await this.iotHubService.sendMessage(body);
    res.json(response);
  }
}