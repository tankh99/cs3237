import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MicService } from './mic.service';
import { MicController } from './mic.controller';

@Module({
  imports: [],
  controllers: [MicController],
  providers: [PrismaService, MicService],
})
export class MicModule {}
