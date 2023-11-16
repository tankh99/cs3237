import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async classifyActivity(messages): Promise<string> {
    const activityLookback = 10;
    const activityData = messages.slice(-activityLookback); // Get enough entries for lookback classification
    const activityTypeRes = await axios.post(
      `${process.env.AI_API_URL}/classify-activity`,
      { data: activityData },
    );
    const activityType = activityTypeRes.data;

    return activityType;
  }

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
    console.log("micdata", micData);
    const updrsRes = await axios.post(`${process.env.AI_API_URL}/get-updrs`, {
      data: micData,
    });
    const updrs = updrsRes.data;
    return updrs;
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
    
    const jitterAbsRange = maxJitterAbs - minJitterAbs != 0 ? maxJitterAbs - minJitterAbs : 1;
    const jitterRapRange = maxJitterRap - minJitterRap != 0 ? maxJitterRap - minJitterRap : 1;
    const jitterPPQ5Range = maxJitterPPQ5 - minJitterPPQ5 != 0 ? maxJitterPPQ5 - minJitterPPQ5 : 1;
    const jitterDDPRange = maxJitterDDP - minJitterDDP != 0 ? maxJitterDDP - minJitterDDP : 1;
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
