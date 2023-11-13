import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Client } from 'azure-iothub';
// import { Message } from 'azure-iot-common';
import {
  EventData,
  EventHubBufferedProducerClient,
  EventHubConsumerClient,
  EventHubProducerClient,
  ReceivedEventData,
} from '@azure/event-hubs';
import { Server } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

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
@Injectable()
export class IothubService implements OnModuleInit {
  constructor(
    private socketSerice: SocketService,
    private prismaService: PrismaService,
  ) {}
  timerId: NodeJS.Timeout;
  connectionString = `Endpoint=${process.env.ENDPOINT};EntityPath=${process.env.ENTITY_PATH};SharedAccessKeyName=device;SharedAccessKey=${process.env.SHARED_ACCESS_KEY};HostName=${process.env.HOST_NAME}`;
  messages = [];
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

  async triggerLcd() {
    const LCD_KEY = 'LET THERE BE LIGHT';
    try {
      // const event: EventData = new Event('lcd', {});
      const result = await this.producer.enqueueEvent({
        body: LCD_KEY,
        // contentType: 'text/plain',
      });
      console.log('Sent message', LCD_KEY);
      return result;
    } catch (ex) {
      console.error(ex);
    }
  }

  async messageHandler(events: ReceivedEventData[]) {
    for (const event of events) {
      const deviceId = event.systemProperties['iothub-connection-device-id'];

      let data: IMUActivityEventRecording = {
        key: 'imu1',
        x: 0,
        y: 0,
        z: 0,
        timestamp: Date.now(),
        device_id: deviceId,
        activity_type: '',
      };
      // Assume we receive JSOn only
      const body = event.body;
      if (typeof body === 'object') {
        for (const coord of event.body.data) {
          data = {
            ...data,
            ...coord,
          };
          this.messages.push(data);
        }
      }
    }
    // Prevent sending data if there are stilll messages within 10ms
    const DELAY = 3000; // Wait DELAY ms before sending data to the database. There's an issue where if you move this to class body, the function runs immmediately
    clearTimeout(this.timerId);

    // Wait for the user to label their data and set their name before receiving it on the server
    this.timerId = setTimeout(async () => {
      let medicationStatus = false;
      let activityType = '';
      if (this.messages.length === 0) return;
      console.log('Sending', JSON.stringify(this.messages));
      try {
        const medicationStatusRes = await axios.post(
          `${process.env.AI_API_URL}/classify-tremor`,
          this.messages,
        );
        medicationStatus = medicationStatusRes.data;

        const activityTypeRes = await axios.post(
          `${process.env.AI_API_URL}/classify-activity`,
          this.messages,
        );
        activityType = activityTypeRes.data;

        const activityClassification: ActivityClassification = {
          timestamp: Date.now(),
          activityType: activityType,
          medicationStatus: medicationStatus,
        };
        console.log('Classification', activityClassification);
        this.socketSerice.socket.emit(
          process.env.CLASSIFICATION_CLIENT,
          JSON.stringify(activityClassification),
        );
      } catch (ex) {
        console.error(ex);
      }
      this.socketSerice.socket.emit(
        process.env.EVENTS_CLIENT,
        JSON.stringify(this.messages),
      );
      this.messagesToStore = this.messagesToStore.concat(this.messages);
      this.messages = [];
    }, DELAY);
  }

  async errorHandler(err: any) {
    console.log('Hello error received');
    console.log(err.message);
  }
}
