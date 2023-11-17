import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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

  @Post('/send')
  async sendMessage(@Body() body, @Res() res) {
    const response = await this.iothubService.sendMessage(body);
    res.json(response);
  }
}
