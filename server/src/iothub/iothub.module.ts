import { SocketService } from './../socket/socket.service';
import { Module } from '@nestjs/common';
import { IothubService } from './iothub.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { IothubController } from './iothub.controller';
import { ClassificationService } from 'src/classification/classification.service';

@Module({
  imports: [],
  controllers: [IothubController],
  providers: [PrismaService, IothubService, ClassificationService],
})
export class IothubModule {}
