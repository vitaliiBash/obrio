import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UploadController } from './modules/upload/upload.controller';
import { GoogleDriveModule } from './modules/google-drive/google-drive.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [UploadModule, GoogleDriveModule],
  controllers: [AppController, UploadController, GoogleDriveModule],
  providers: [AppService],
})
export class AppModule {}
