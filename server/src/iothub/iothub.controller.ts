import { Controller, Get, Res } from '@nestjs/common';
import { IothubService } from './iothub.service';

@Controller('iothub')
export class IothubController {
  constructor(private iothubService: IothubService) {}

  @Get('trigger-lcd')
  async triggerLcd(@Res() res) {
    const sentMessages = await this.iothubService.triggerLcd();
    console.log(sentMessages);
    res.send('Sent message');
  }
}
