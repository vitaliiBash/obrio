import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PrismaModule } from 'src/modules/prisma/prsima.module';
import { UploadCreatedListener } from './uploads/upload-created.listener';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GOOGLE_DRIVE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          exchange: 'file-upload',
          queue: 'api.google-drive',
        },
      },
    ]),
    PrismaModule,
  ],
  providers: [UploadCreatedListener],
})
export class ListenersModule {}
