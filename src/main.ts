import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from './filters/database-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DatabaseExceptionFilter());
  await app.listen(process.env.PORT);
  console.log(`My server is running on port ${process.env.PORT}`);
}
bootstrap();
