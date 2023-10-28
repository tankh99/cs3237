import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { IMUActivityEventRecording } from 'src/iothub/iothub.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  messages = [];
  timerId;
  constructor(private prismaService: PrismaService) {}

  async createEvents(events: IMUActivityEventRecording[]) {
    this.prismaService.activityRecording
      .createMany({
        data: events,
      })
      .then((res) => {
        console.log('Creation succes', res);
      })
      .catch((err) => {
        console.error('Creation error', err);
      });
  }
}
