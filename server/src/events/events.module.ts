import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [AppGateway, PrismaService, EventsService],
})
export class EventsModule {}
