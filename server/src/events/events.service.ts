import { Injectable } from '@nestjs/common';
import {
  IMUActivityEventRecording,
  IMUTremorRecording,
} from 'src/iothub/iothub.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async createActivityRecordings(events: IMUActivityEventRecording[]) {
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

  async createTremorClassifications(events: IMUTremorRecording[]) {
    this.prismaService.tremorClassification
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
