import { Module } from '@nestjs/common';
import { ClassificationController } from './classification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClassificationService } from './classification.service';

@Module({

  imports: [],
  controllers: [ClassificationController],
  providers: [PrismaService, ClassificationService],
})
export class ClassificationModule {}
