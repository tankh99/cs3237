import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Client } from 'azure-iothub';
// import { Message } from 'azure-iot-common';
import {
  EventHubBufferedProducerClient,
  EventHubConsumerClient,
  ReceivedEventData,
} from '@azure/event-hubs';
import { SocketService } from 'src/socket/socket.service';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { Client, Registry } from 'azure-iothub';

export type IMUActivityEventRecording = {
  key: string;
  x: number;
  y: number;
  z: number;
  timestamp: number;
  device_id: string;
  activity_type: string;
};

export type ActivityClassification = {
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
@Injectable()
export class IothubService implements OnModuleInit {
  constructor(
    private socketSerice: SocketService,
    private prismaService: PrismaService,
  ) {}
  micTimerId: NodeJS.Timeout;
  imuTimerId: NodeJS.Timeout;
  connectionString = `Endpoint=${process.env.ENDPOINT};EntityPath=${process.env.ENTITY_PATH};SharedAccessKeyName=device;SharedAccessKey=${process.env.SHARED_ACCESS_KEY};HostName=${process.env.HOST_NAME}`;
  imu = [];
  mic = [];
  messagesToStore = [];
  producer: EventHubBufferedProducerClient;
  onModuleInit() {
    console.log('Initialising IOT Hub server');
    const client = new EventHubConsumerClient(
      process.env.EVENT_HUB_CONSUMER_GROUP,
      this.connectionString,
      // {},
    );
    client.subscribe({
      processEvents: (events) => this.messageHandler(events),
      processError: this.errorHandler,
    });
    console.log('Susbcribed to IoTHub');

    this.producer = new EventHubBufferedProducerClient(
      this.connectionString,
      process.env.ENTITY_PATH,
      {
        maxWaitTimeInMs: 1000, // Wait at most 1000ms before sending
        maxEventBufferLengthPerPartition: 1000, // OR until 1000 messages have been enqueued
        onSendEventsErrorHandler: (err) => {
          console.error(err);
        },
      },
    );
  }

  async sendMessage(message: string) {
    try {
      await this.producer.enqueueEvent({ body: message });
      console.log('Sent message', message);

      return message;
    } catch (ex) {
      console.error(ex);
    }
  }

  // Send message directly to device, rather than event hubs
  async triggerLcd() {
    const LCD_KEY = 'LET THERE BE LIGHT';
    const connectionString = this.connectionString;
    const deviceId = process.env.DEVICE_ID;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const registry = Registry.fromConnectionString(connectionString);
    const client = Client.fromConnectionString(connectionString);
    client.open((err) => {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Client connected to IoT Hub.');

        client.on('message', (message) => {
          console.log('Received message from device: ' + message.getData());
        });
      }
    });

    client.send(deviceId, LCD_KEY, (err) => {
      if (err) {
        console.error('Error sending message:', err.toString());
      } else {
        console.log('Message sent successfully.');
      }
    });
    // try {
    //   // const event: EventData = new Event('lcd', {});
    //   const result = await this.producer.enqueueEvent({
    //     body: LCD_KEY,
    //     // contentType: 'text/plain',
    //   });
    //   console.log('Sent message', LCD_KEY);
    //   return result;
    // } catch (ex) {
    //   console.error(ex);
    // }
  }

  async messageHandler(events: ReceivedEventData[]) {
    let isImu = false;
    let isMic = false;
    for (const event of events) {
      const deviceId = event.systemProperties['iothub-connection-device-id'];

      // Assume we receive JSOn only
      const body = event.body;
      if (typeof body === 'object') {
        if (event.body.key === 'mic_2') {
          isMic = true;
          for (const data of event.body.data) {
            const micData: MicRecording = {
              ...data,
              timestamp: Date.now(),
            };
            this.mic.push(micData);
          }
        } else {
          isImu = true;
          for (const coord of event.body.data) {
            const imuData: IMUActivityEventRecording = {
              ...coord,
              timestamp: Date.now(),
              device_id: deviceId,
            };
            this.imu.push(imuData);
          }
        }
      }
    }
    // Prevent sending data if there are stilll messages within 10ms
    const DELAY = 3000; // Wait DELAY ms before sending data to the database. There's an issue where if you move this to class body, the function runs immmediately
    if (isImu) clearTimeout(this.imuTimerId);
    if (isMic) clearTimeout(this.micTimerId);

    // This function only displays the data to the user, and does not save anything yet!
    this.imuTimerId = setTimeout(async () => {
      // console.log('Sending', JSON.stringify(this.messages));
      if (this.imu.length > 0) {
        try {
          // console.log(tremorData);
          // console.log(activityData);
          this.normaliseImuData(this.imu);
          const medicationStatus = await this.classifyTremor(this.imu);
          const activityType = await this.classifyActivity(this.imu);
  
          const activityClassification: ActivityClassification = {
            timestamp: Date.now(),
            activityType: activityType,
            medicationStatus: medicationStatus,
          };
  
          // console.log('Classification', activityClassification);
          this.socketSerice.socket.emit(
            process.env.CLASSIFICATION_CLIENT,
            JSON.stringify(activityClassification),
          );
        } catch (ex) {
          console.error(ex);
        }
        this.socketSerice.socket.emit(
          process.env.EVENTS_CLIENT,
          JSON.stringify(this.imu),
        );
        // this.messagesToStore = this.messagesToStore.concat(this.imu);
      }
      this.imu = [];
    }, DELAY);

    this.micTimerId = setTimeout(async () => {
      // console.log('Sending', JSON.stringify(this.messages));
      if (this.mic.length > 0) {
        try {
          // console.log(tremorData);
          // console.log(activityData);
          const updrs = await this.classifyMic(this.mic);
          // console.log('Classification', activityClassification);
          
          this.socketSerice.socket.emit(
            process.env.MIC_CLIENT,
            JSON.stringify({
              updrs,
            }),
          );
        } catch (ex) {
          console.error(ex);
        }
        
        // this.socketSerice.socket.emit(
        //   process.env.MIC_CLIENT,
        //   JSON.stringify(this.mic),
        // );

        // this.messagesToStore = this.messagesToStore.concat(this.imu);
        this.mic = [];
      };

    }, DELAY);
  }

  async errorHandler(err: any) {
    console.log('Error:');
    // console.log(err.message);
  }

  normaliseImuData(data: IMUActivityEventRecording[]) {
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;
    for (const recording of data) {
      xSum += recording.x;
      ySum += recording.y;
      zSum += recording.z;
    }
    const xAvg = xSum / data.length;
    const yAvg = ySum / data.length;
    const zAvg = zSum / data.length;
    for (const recording of data) {
      recording.x -= xAvg;
      recording.y -= yAvg;
      recording.z -= zAvg;
    }
    return data;
  }

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
    const tremorLookback = 10;
    const tremorData = messages.slice(-tremorLookback); // Get enough entries for lookback classification
    const medicationStatusRes = await axios.post(
      `${process.env.AI_API_URL}/classify-tremor`,
      { data: tremorData },
    );
    const medicationStatus = medicationStatusRes.data;
    return medicationStatus;
  }
  
  async classifyMic(messages): Promise<number[]> {
    // const micLookback = 10;
    // const micData = messages.slice(-micLookback); // Get enough entries for lookback classification
    const micData = messages;
    const updrsRes = await axios.post(
      `${process.env.AI_API_URL}/get-updrs`,
      { data: micData },
    );
    const updrs = updrsRes.data;
    return updrs;
  }
}
