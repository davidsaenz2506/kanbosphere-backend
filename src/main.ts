import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { urlencoded, json } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { SocketIdService } from './sockets/socketid.service';
import { SocketGateway } from './datasocket/socket.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const nestPort = process.env.PORT || 5000;
  const socketPort = 9000;

  await app.listen(nestPort);
  const httpServer = createServer(app.getHttpServer());

  const io = new Server(httpServer, { cors: { origin: '*' } });
  const socketProvider = app.get(SocketIdService);

  io.on('connection', (request) => {

    socketProvider.setSocket(request);

    request.on('joinToRoom', (dataSet) => {
      request.join(dataSet);
    });

    request.on('joinToWorkspaceRoom', (dataSet) => {
      request.join(dataSet);
    });
  });

  httpServer.listen(socketPort, () => {
    console.log(`Socket.IO server listening on port ${socketPort}`);
  });

  app.get(SocketGateway).setSockerServer(io)
}

bootstrap();