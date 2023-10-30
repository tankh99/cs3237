import { Injectable, OnModuleInit } from '@nestjs/common';

import { EventHubBufferedProducerClient, EventHubConsumerClient, EventHubProducerClient, ReceivedEventData } from '@azure/event-hubs';
import { Server } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { PrismaService } from 'src/prisma/prisma.service';

export type IMUActivityEventRecording = {
  key: string;
  x: number;
  y: number;
  z: number;
  timestamp: number;
  device_id: string;
  activity_type: string;
};

@Injectable()
export class IothubService implements OnModuleInit {
  constructor(
    private socketSerice: SocketService,
    private prismaService: PrismaService,
  ) {}
  timerId: NodeJS.Timeout;
  connectionString = `Endpoint=${process.env.ENDPOINT};EntityPath=${process.env.ENTITY_PATH};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.SHARED_ACCESS_KEY};HostName=${process.env.HOST_NAME}`;
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
      console.log('Received', this.messages);
    }
    // Prevent sending data if there are stilll messages within 10ms
    const DELAY = 1000; // Wait DELAY ms before sending data to the database. There's an issue where if you move this to class body, the function runs immmediately
    clearTimeout(this.timerId);

    // Wait for the user to label their data and set their name before receiving it on the server
    this.timerId = setTimeout(() => {

      console.log('Sending', JSON.stringify(this.messages));
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
