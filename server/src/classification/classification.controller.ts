import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('classification')
export class ClassificationController {
  constructor(
    private readonly classificationService: ClassificationService,
    private readonly prismaService: PrismaService,
  ) {}
  @Get()
  async getUpdrs(@Body() body, @Res() res) {
    // const normalisedImuData = this.normaliseImuData(body);
    const soundData = await this.prismaService.soundData.findMany();
    res.json(soundData);
  }
  @Post()
  async classifyUpdrs(@Body() body, @Res() res) {
    // const normalisedImuData = this.normaliseImuData(body);
    const classification = await this.classificationService.classifyMic(
      body.data,
    );
    console.log(classification);
    res.json(classification);
  }

}
