import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export type SoundData = {
  jitterAbs: number;
  jitterRap: number;
  jitterPPQ5: number;
  jitterDDP: number;
  shimmerLocal: number;
  shimmerLocalDB: number;
  shimmerAPQ3: number;
  shimmerAPQ5: number;
  shimmerAPQ11: number;
  shimmerDDA: number;
  updrs: number;
  severity: number;
  session_name?: string;
}

@Injectable()
export class MicService {
  constructor(private prismaService: PrismaService) {}
  async createSoundData(soundData: SoundData[]) {
    this.prismaService.soundData
      .createMany({
        data: soundData,
      })
      .then((res) => {
        console.log('Created sound data', res);
      })
      .catch((err) => {
        console.error('Creation error', err);
      });
  }
}
