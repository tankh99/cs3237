import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { SocketService } from './socket/socket.service';
import { SocketModule } from './socket/socket.module';
import { IothubModule } from './iothub/iothub.module';

@Module({
  imports: [ConfigModule.forRoot(), SocketModule, EventsModule, IothubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private socketService: SocketService) {}

  onModuleInit() {
    // initClient(this.socketService.socket);
  }
}
