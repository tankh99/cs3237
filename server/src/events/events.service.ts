import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  messages = [];
  timerId;
  constructor(private prisma: PrismaService) {}
}
  
