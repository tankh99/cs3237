import { Body, Controller, Post } from '@nestjs/common';
import { EventsService, IMUTremorActivityRecording } from './events.service';

@Controller('events')
export class EventsController {
  connectionString: string;
  constructor(private readonly eventsService: EventsService) {}

  @Post('/activities')
  async createActivityRecordings(@Body() body) {
    // const normalisedImuData = this.normaliseImuData(body);
    this.eventsService.createActivityRecordings(body);
    return 'Done';
  }

  @Post('/tremors')
  async createTremorClassification(@Body() body) {
    // const normalisedImuData = this.normaliseImuData(body);
    this.eventsService.createTremorClassifications(body);
    return 'Done';
  }

}
