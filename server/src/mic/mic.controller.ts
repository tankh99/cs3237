import { Body, Controller, Post } from '@nestjs/common';
import { MicService } from './mic.service';

@Controller('mic')
export class MicController {
  constructor(
    private readonly micService: MicService, // private socketService: SocketService,
  ) {}

  @Post()
  async createSoundData(@Body() body) {
    this.micService.createSoundData(body);
    return 'Created';
  }
}
