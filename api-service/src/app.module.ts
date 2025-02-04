import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from './modules/prisma/prisma.service';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ListenersModule } from './modules/listeners/listeners.module';
import { PrismaModule } from './modules/prisma/prsima.module';
import { AuthGuard } from './common/guards/auth.guard';

import { UploadsController } from './modules/uploads/uploads.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      verboseMemoryLeak: true,
    }),
    UploadsModule,
    ListenersModule,
    PrismaModule,
  ],
  controllers: [AppController, UploadsController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
