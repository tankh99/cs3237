import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async createActivityRecordings(events: IMUTremorActivityRecording[]) {
    this.prismaService.activityRecording
      .createMany({
        data: events,
      })
      .then((res) => {
        console.log('Creation succes', res);
      })
      .catch((err) => {
        console.error('Creation error', err);
      });
  }

  async createTremorClassifications(events: IMUTremorActivityRecording[]) {
    this.prismaService.tremorClassification
      .createMany({
        data: events,
      })
      .then((res) => {
        console.log('Creation succes', res);
      })
      .catch((err) => {
        console.error('Creation error', err);
      });
  }

  // Normalise within the 1875 entries
  // Normalises only only for activity recrodings, doesn't have stdev
  normaliseImuData(data: IMUTremorActivityRecording[]) {
    // const thresholdLength = 1875;
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;
    // get a maximum number of entries
    // if (data.length > thresholdLength) data = data.slice(-thresholdLength);
    const n = data.length;
    // const xStdev = Math.sqrt(
    //   data.map((x) => Math.pow(x.x - xAvg, 2)).reduce((a, b) => a + b) / n,
    // );
    // const yStdev = Math.sqrt(
    //   data.map((x) => Math.pow(x.y - yAvg, 2)).reduce((a, b) => a + b) / n,
    // );
    // const zStdev = Math.sqrt(
    //   data.map((x) => Math.pow(x.z - zAvg, 2)).reduce((a, b) => a + b) / n,
    // );
    for (const recording of data) {
      xSum += recording.x;
      ySum += recording.y;
      zSum += recording.z;
    }
    const xAvg = xSum / data.length;
    const yAvg = ySum / data.length;
    const zAvg = zSum / data.length;
    // console.log("xstedv", xStdev)
    // console.log("ystedv", yStdev)
    // console.log("zstedv", zStdev)
    for (const recording of data) {
      recording.x -= xAvg;
      // recording.x /= xStdev;

      recording.y -= yAvg;
      // recording.y /= yStdev;

      recording.z -= zAvg;
      // recording.z /= zStdev;
    }

    return data;
  }
  
}

export type IMURecording = {
  x: number;
  y: number;
  z: number;
};


export type IMUTremorActivityRecording = IMURecording & {
  sessionName?: string;
  activityName: string;
  timestamp: number;
  medicationStatus: boolean;
};

// Used for diary entry. Shows both medication status and activity predicted givne IMU values
export type IMUClassificationResult = {
  timestamp: number;
  name?: string;
  device_id?: string;
  activityType: string;
  medicationStatus: boolean;
};

export type MicRecording = {
  p2p: number;
  ff: number;
  device_id?: string;
  timestamp: number;
};