import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async classifyActivity(messages): Promise<string> {
    const activityLookback = 10;
    const ONE_SECOND = 32;
    const stepSize = Math.floor(ONE_SECOND / 3);

    const data = [];
    // Cut up data into 1 second chunks since 1 second = 32 entries
    for (let i = 0; i < messages.length; i += stepSize) {
      data.push(messages[i]);
    }
    const activityData = messages.slice(-activityLookback); // Get enough entries for lookback classification
    const activityTypeRes = await axios.post(
      `${process.env.AI_API_URL}/classify-activity`,
      { data: activityData },
    );
    const activityType = activityTypeRes.data;

    return activityType;
  }

  //
  async classifyTremor(messages): Promise<boolean> {
    // const tremorLookback = 10;
    const tremorData = messages;
    // const tremorData = messages.slice(-tremorLookback); // Get enough entries for lookback classification
    const medicationStatusRes = await axios.post(
      `${process.env.AI_API_URL}/classify-tremor`,
      { data: tremorData },
    );
    const medicationStatus = medicationStatusRes.data;
    return medicationStatus;
  }

  async classifyMic(messages): Promise<number> {
    // const micLookback = 10;
    // const micData = messages.slice(-micLookback); // Get enough entries for lookback classification
    const originalData = await this.prismaService.soundData.findMany();
    const micData = this.normaliseMicData(originalData, messages);
    console.log('micdata', micData);
    const updrsRes = await axios.post(`${process.env.AI_API_URL}/get-updrs`, {
      data: micData,
    });
    const updrs = updrsRes.data;
    return updrs;
  }

  // Normalise within the 1875 entries
  // Normalises only only for activity recrodings, doesn't have stdev
  normaliseImuData(data: IMUTremorActivityRecording[]) {
    // const thresholdLength = 1875;
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;
    // get a maximum number of entries
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

  normaliseMicData(originalData, messages) {
    let minJitterAbs = Number.MAX_VALUE;
    let minJitterRap = Number.MAX_VALUE;
    let minJitterPPQ5 = Number.MAX_VALUE;
    let minJitterDDP = Number.MAX_VALUE;
    let minShimmerLocal = Number.MAX_VALUE;
    let minShimmerLocalDB = Number.MAX_VALUE;
    let minShimmerAPQ3 = Number.MAX_VALUE;
    let minShimmerAPQ5 = Number.MAX_VALUE;
    let minShimmerAPQ11 = Number.MAX_VALUE;
    let minShimmerDDA = Number.MAX_VALUE;

    let maxJitterAbs = Number.MIN_VALUE;
    let maxJitterRap = Number.MIN_VALUE;
    let maxJitterPPQ5 = Number.MIN_VALUE;
    let maxJitterDDP = Number.MIN_VALUE;
    let maxShimmerLocal = Number.MIN_VALUE;
    let maxShimmerLocalDB = Number.MIN_VALUE;
    let maxShimmerAPQ3 = Number.MIN_VALUE;
    let maxShimmerAPQ5 = Number.MIN_VALUE;
    let maxShimmerAPQ11 = Number.MIN_VALUE;
    let maxShimmerDDA = Number.MIN_VALUE;

    originalData.forEach((data) => {
      minJitterAbs = Math.min(minJitterAbs, data.jitterAbs);
      minJitterRap = Math.min(minJitterRap, data.jitterRap);
      minJitterPPQ5 = Math.min(minJitterPPQ5, data.jitterPPQ5);
      minJitterDDP = Math.min(minJitterDDP, data.jitterDDP);
      minShimmerLocal = Math.min(minShimmerLocal, data.shimmerLocal);
      minShimmerLocalDB = Math.min(minShimmerLocalDB, data.shimmerLocalDB);
      minShimmerAPQ3 = Math.min(minShimmerAPQ3, data.shimmerAPQ3);
      minShimmerAPQ5 = Math.min(minShimmerAPQ5, data.shimmerAPQ5);
      minShimmerAPQ11 = Math.min(minShimmerAPQ11, data.shimmerAPQ11);
      minShimmerDDA = Math.min(minShimmerDDA, data.shimmerDDA);

      maxJitterAbs = Math.max(maxJitterAbs, data.jitterAbs);
      maxJitterRap = Math.max(maxJitterRap, data.jitterRap);
      maxJitterPPQ5 = Math.max(maxJitterPPQ5, data.jitterPPQ5);
      maxJitterDDP = Math.max(maxJitterDDP, data.jitterDDP);
      maxShimmerLocal = Math.max(maxShimmerLocal, data.shimmerLocal);
      maxShimmerLocalDB = Math.max(maxShimmerLocalDB, data.shimmerLocalDB);
      maxShimmerAPQ3 = Math.max(maxShimmerAPQ3, data.shimmerAPQ3);
      maxShimmerAPQ5 = Math.max(maxShimmerAPQ5, data.shimmerAPQ5);
      maxShimmerAPQ11 = Math.max(maxShimmerAPQ11, data.shimmerAPQ11);
      maxShimmerDDA = Math.max(maxShimmerDDA, data.shimmerDDA);
    });
    messages.forEach((data) => {
      minJitterAbs = Math.min(minJitterAbs, data.jitterAbs);
      minJitterRap = Math.min(minJitterRap, data.jitterRap);
      minJitterPPQ5 = Math.min(minJitterPPQ5, data.jitterPPQ5);
      minJitterDDP = Math.min(minJitterDDP, data.jitterDDP);
      minShimmerLocal = Math.min(minShimmerLocal, data.shimmerLocal);
      minShimmerLocalDB = Math.min(minShimmerLocalDB, data.shimmerLocalDB);
      minShimmerAPQ3 = Math.min(minShimmerAPQ3, data.shimmerAPQ3);
      minShimmerAPQ5 = Math.min(minShimmerAPQ5, data.shimmerAPQ5);
      minShimmerAPQ11 = Math.min(minShimmerAPQ11, data.shimmerAPQ11);
      minShimmerDDA = Math.min(minShimmerDDA, data.shimmerDDA);

      maxJitterAbs = Math.max(maxJitterAbs, data.jitterAbs);
      maxJitterRap = Math.max(maxJitterRap, data.jitterRap);
      maxJitterPPQ5 = Math.max(maxJitterPPQ5, data.jitterPPQ5);
      maxJitterDDP = Math.max(maxJitterDDP, data.jitterDDP);
      maxShimmerLocal = Math.max(maxShimmerLocal, data.shimmerLocal);
      maxShimmerLocalDB = Math.max(maxShimmerLocalDB, data.shimmerLocalDB);
      maxShimmerAPQ3 = Math.max(maxShimmerAPQ3, data.shimmerAPQ3);
      maxShimmerAPQ5 = Math.max(maxShimmerAPQ5, data.shimmerAPQ5);
      maxShimmerAPQ11 = Math.max(maxShimmerAPQ11, data.shimmerAPQ11);
      maxShimmerDDA = Math.max(maxShimmerDDA, data.shimmerDDA);
    });

    const jitterAbsRange =
      maxJitterAbs - minJitterAbs != 0 ? maxJitterAbs - minJitterAbs : 1;
    const jitterRapRange =
      maxJitterRap - minJitterRap != 0 ? maxJitterRap - minJitterRap : 1;
    const jitterPPQ5Range =
      maxJitterPPQ5 - minJitterPPQ5 != 0 ? maxJitterPPQ5 - minJitterPPQ5 : 1;
    const jitterDDPRange =
      maxJitterDDP - minJitterDDP != 0 ? maxJitterDDP - minJitterDDP : 1;
    const shimmerLocalRange = maxShimmerLocal - minShimmerLocal;
    const shimmerLocalDBRange = maxShimmerLocalDB - minShimmerLocalDB;
    const shimmerAPQ3Range = maxShimmerAPQ3 - minShimmerAPQ3;
    const shimmerAPQ5Range = maxShimmerAPQ5 - minShimmerAPQ5;
    const shimmerAPQ11Range = maxShimmerAPQ11 - minShimmerAPQ11;
    const shimmerDDARange = maxShimmerDDA - minShimmerDDA;

    messages.forEach((data) => {
      data.jitterAbs = (data.jitterAbs - minJitterAbs) / jitterAbsRange;
      data.jitterRap = (data.jitterRap - minJitterRap) / jitterRapRange;
      data.jitterPPQ5 = (data.jitterPPQ5 - minJitterPPQ5) / jitterPPQ5Range;
      data.jitterDDP = (data.jitterDDP - minJitterDDP) / jitterDDPRange;
      data.shimmerLocal =
        (data.shimmerLocal - minShimmerLocal) / shimmerLocalRange;
      data.shimmerLocalDB =
        (data.shimmerLocalDB - minShimmerLocalDB) / shimmerLocalDBRange;
      data.shimmerAPQ3 = (data.shimmerAPQ3 - minShimmerAPQ3) / shimmerAPQ3Range;
      data.shimmerAPQ5 = (data.shimmerAPQ5 - minShimmerAPQ5) / shimmerAPQ5Range;
      data.shimmerAPQ11 =
        (data.shimmerAPQ11 - minShimmerAPQ11) / shimmerAPQ11Range;
      data.shimmerDDA = (data.shimmerDDA - minShimmerDDA) / shimmerDDARange;
    });
    return messages;
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
