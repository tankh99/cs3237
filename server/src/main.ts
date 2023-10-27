import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: false,
    origin: ['http://localhost:3000'],
  });
  // app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
