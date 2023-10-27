import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  connectionString = `Endpoint=${process.env.ENDPOINT};EntityPath=${process.env.ENTITY_PATH};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.SHARED_ACCESS_KEY};HostName=${process.env.HOST_NAME}`;

  async initClient() {
    const client = new EventHubConsumerClient(
      process.env.EVENT_HUB_CONSUMER_GROUP,
      this.connectionString,
      // {},
    );
    client.subscribe({
      processEvents: this.messageHandler,
      processError: this.errorHandler,
    });
    console.log('Susbcribed');
  }

  async messageHandler(events: ReceivedEventData[]) {
    for (const event of events) {
      const decoder = new TextDecoder('utf-8'); // Specify the encoding if known (e.g., 'utf-8')
      const text = decoder.decode(event.body);
      console.log(text);
    }
  }

  async errorHandler(err: any) {
    console.log('Hello error received');
    console.log(err.message);
  }
}
