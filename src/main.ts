import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api")
  app.enableCors()
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
