import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {

  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  await app.listen(config.get('configuration.server.port'));
  
  logger.log(`Application listening on port ${config.get<string>('configuration.server.port')}`);
}
bootstrap();
