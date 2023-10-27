import { Controller, Get, Res } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  connectionString: string;
  constructor(private readonly eventsService: EventsService) {
    eventsService.initClient();
  }

  @Get()
  async subscribeToEvents() {
    const iotHubConnectionString = process.env.CONNECTION_STRING;
    if (!iotHubConnectionString) {
      console.error(
        `Environment variable IotHubConnectionString must be specified.`,
      );
      return;
    }
    console.log(`Using IoT Hub connection string [${iotHubConnectionString}]`);

    const eventHubConsumerGroup = '';
    console.log(eventHubConsumerGroup);
    if (!eventHubConsumerGroup) {
      console.error(
        `Environment variable EventHubConsumerGroup must be specified.`,
      );
      return;
    }
  }
}