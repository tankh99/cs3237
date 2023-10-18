import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  require('dotenv').config() // load keys
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: false,
    origin: ['http://localhost:3000'],
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
