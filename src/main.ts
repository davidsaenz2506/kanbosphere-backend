import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { urlencoded, json } from 'express';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use((req: Request, res: Response, next: Function) => {

    next();
  });

  const port = process.env.PORT;
  const currentServer = await app.listen(port || 5000);
  const io = new Server(currentServer, { cors: { origin: '*' } });
 
  io.on('connection', (request) => {
      request.on('joinToRoom', (dataSet) => {
         request.join(dataSet)
      })
  })

  app.get('SOCKET_SERVER').instance = io;
}
bootstrap();
