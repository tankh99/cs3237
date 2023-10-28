import { Injectable, OnModuleInit } from '@nestjs/common';

import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { Server } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { PrismaService } from 'src/prisma/prisma.service';

export type IMUActivityEventRecording = {
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
  }

  async messageHandler(events: ReceivedEventData[]) {
    for (const event of events) {
      // console.log(event)
      const deviceId = event.systemProperties['iothub-connection-device-id'];
      let data: IMUActivityEventRecording = {
        x: 0,
        y: 0,
        z: 0,
        timestamp: Date.now(),
        device_id: deviceId,
        activity_type: '',
      };
      // Assume we receive JSOn only
      data = {
        ...data,
        ...event.body,
      };
      this.messages.push(data);
      console.log('Received', data);
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
      // console.log(
      //   'I am storing data into the database now',
      //   this.messagesToStore,
      // );
      // // const pService = this.prismaService;
      // const events = [];
      // for (let i = 0; i < this.messagesToStore.length; i++) {
      //   const message = this.messagesToStore[i].imu;
      //   const event: IOTEvent = {
      //     x: message.x,
      //     y: message.y,
      //     z: message.z,
      //     timestamp: Date.now(),
      //     person_id: 1,
      //   };
      //   events.push(event);
      //   console.log(event);

      //   // this.prismaService.activityRecording
      //   //   .create({
      //   //     data: event,
      //   //   })
      //   //   .then((created) => {
      //   //     console.log(created);
      //   //   })
      //   //   .catch((err) => {
      //   //     console.error(err);
      //   //   });
      // }
      // this.prismaService.activityRecording
      //   .createMany({
      //     data: events,
      //   })
      //   .then((created) => {
      //     console.log(created);
      //     this.messagesToStore = this.messages;
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //   });
    }, DELAY);
  }

  async errorHandler(err: any) {
    console.log('Hello error received');
    console.log(err.message);
  }
}
