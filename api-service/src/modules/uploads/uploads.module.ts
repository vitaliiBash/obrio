import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prsima.module';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [PrismaModule],
  providers: [UploadsService],
  controllers: [UploadsController],
  exports: [UploadsService],
})
export class UploadsModule {}
