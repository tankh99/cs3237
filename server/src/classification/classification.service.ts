import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClassificationService {


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
    const micData = messages;
    const updrsRes = await axios.post(`${process.env.AI_API_URL}/get-updrs`, {
      data: micData,
    });
    const updrs = updrsRes.data;
    return updrs;
  }

}
