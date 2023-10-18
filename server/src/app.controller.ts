import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Registry, Client } from 'azure-iothub';
import 'dotenv/config'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res) {
    const connectionString = `HostName=${process.env.HOSTNAME};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.PRIVATEKEY}`;
    const deviceId = '${process.env.DEVICEID}';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const registry = Registry.fromConnectionString(connectionString);
    const client = Client.fromConnectionString(connectionString);

    client.open((err) => {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Client connected');

        client.on('message', (message) => {
          console.log('Received message from device: ' + message.getData());
        });
      }
    });

    client.send(deviceId, 'Hello from the server', (err) => {
      if (err) {
        console.error('Error sending message:', err.toString());
      } else {
        console.log('Message sent successfully.');
      }
    });
    res.json(this.appService.getHello());
  }
}
