import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const port = process.env.PORT;
  await app.listen(port || 5000);
}
bootstrap();
