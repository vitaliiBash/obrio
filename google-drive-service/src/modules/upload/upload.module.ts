import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

import { GoogleDriveModule } from 'src/modules/google-drive/google-drive.module';

@Module({
  imports: [GoogleDriveModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
