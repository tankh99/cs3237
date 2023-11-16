import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { EventsService } from './events.service';
import { SocketService } from 'src/socket/socket.service';
import { AppGateway } from '../app.gateway';
import { IothubService } from 'src/iothub/iothub.service';

@Controller('events')
export class EventsController {
  connectionString: string;
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventsGateway: AppGateway,
  ) {}

  @Post('/activities')
  async createActivityRecordings(@Body() body) {
    this.eventsService.createActivityRecordings(body);
    return 'Done';
  }

  @Post('/tremors')
  async createTremorClassification(@Body() body) {
    this.eventsService.createTremorClassifications(body);
    return 'Done';
  }

}