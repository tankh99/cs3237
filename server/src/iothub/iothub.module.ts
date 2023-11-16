import { SocketService } from './../socket/socket.service';
import { Module } from '@nestjs/common';
import { IothubService } from './iothub.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { IothubController } from './iothub.controller';

@Module({
  imports: [],
  controllers: [IothubController],
  providers: [PrismaService, IothubService],
})
export class IothubModule {}
