import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [PrismaService, EventsGateway, EventsService],
})
export class EventsModule {}
