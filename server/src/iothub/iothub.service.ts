import { Injectable, OnModuleInit } from '@nestjs/common';

import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { Server } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class IothubService implements OnModuleInit {
  constructor (private socketSerice: SocketService) {}
  timerId: NodeJS.Timeout;
  connectionString = `Endpoint=${process.env.ENDPOINT};EntityPath=${process.env.ENTITY_PATH};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.SHARED_ACCESS_KEY};HostName=${process.env.HOST_NAME}`;
  messages = [];
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
      const type = typeof event.body;
      let data;
      if (type === 'object') {
        data = event.body;
      } else {
        // raw string
        const decoder = new TextDecoder('utf-8'); // Specify the encoding if known (e.g., 'utf-8')
        data = decoder.decode(event.body);
      }
      this.messages.push(data);
      console.log('Received', data);
    }
    // Prevent sending data if there are stilll messages within 10ms
    const DELAY = 2000; // Wait DELAY ms before sending data to the database. There's an issue where if you move this to class body, the function runs immmediately
    clearTimeout(this.timerId);

    console.log('Sending', JSON.stringify(this.messages));
    this.socketSerice.socket.emit(
      process.env.EVENTS_CLIENT,
      JSON.stringify(this.messages),
    );
    this.messages = [];
    // this.timerId = setTimeout(() => {
    //   console.log('I am storing data into the database now', this.messages);
    //   // this.socketSerice.socket.emit('events', JSON.stringify(this.messages));
    // }, DELAY);
  }

  async errorHandler(err: any) {
    console.log('Hello error received');
    console.log(err.message);
  }
}
