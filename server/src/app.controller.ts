import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // client: Client;
  connectionString: string;
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res) {
    res.send('Hello');
  }
}
