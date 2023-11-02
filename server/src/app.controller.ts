import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  async getHello(@Res() res) {
    const result = await axios.post(
      `${process.env.AI_API_URL}/classify-tremor`,
      {},
    );
    res.send(result.data);
  }
}
