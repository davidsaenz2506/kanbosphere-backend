import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { urlencoded, json } from 'express';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const port = process.env.PORT;
  const currentServer = await app.listen(port || 5000);
  const io = new Server(currentServer, { cors: { origin: "*" } })

  app.get('SOCKET_SERVER').instance = io;
}
bootstrap();
