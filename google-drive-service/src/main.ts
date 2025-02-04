import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CatchInterceptor } from './common/interceptors/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'api.google-drive',
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new CatchInterceptor());

  await app.listen();
}

bootstrap();
