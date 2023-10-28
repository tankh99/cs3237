import { Module } from '@nestjs/common';
import { IothubService } from './iothub.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, IothubService],
})
export class IothubModule {}
