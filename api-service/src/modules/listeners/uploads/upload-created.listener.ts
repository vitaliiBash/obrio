import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ClientProxy,
  RmqRecord,
  RmqRecordBuilder,
} from '@nestjs/microservices';

import { timeout } from 'rxjs';

import { PrismaService } from 'src/modules/prisma/prisma.service';

import { UploadCreatedEventDto } from './dto/upload-events.dto';
import { UploadReply, UploadReplySuccess } from './types/upload.types';
import { Upload } from '@prisma/client';

export class UploadCreatedListener {
  private readonly timeout = 30 * 60 * 1000;

  constructor(
    @Inject('GOOGLE_DRIVE_SERVICE')
    private readonly googleDriveService: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('upload.created')
  async onUploadCreated(payload: UploadCreatedEventDto) {
    const uploads = payload.uploads;

    uploads.forEach(this.handleUpload.bind(this));
  }

  private handleUpload(upload: Upload) {
    const onReply = this.getOnReplyCallback(upload.id);
    const onError = this.getOnErrorCallback(upload.id);

    this.googleDriveService
      .send('upload-file', this.getRecord(upload))
      .pipe(timeout(this.timeout))
      .subscribe({
        next: (data: UploadReply) => {
          return data.status === 'success'
            ? onReply(data.data)
            : onError(new Error(JSON.stringify(data.error)));
        },
        error: (error) => onError(error),
      });
  }

  private getOnReplyCallback(uploadId: number) {
    return async (data: UploadReplySuccess['data']) => {
      await this.prisma.upload.update({
        where: {
          id: uploadId,
        },
        data: {
          status: 'finished',
          link: data.url,
        },
      });
    };
  }

  private getOnErrorCallback(uploadId: number) {
    return async (error: Error) => {
      await this.prisma.upload.update({
        where: {
          id: uploadId,
        },
        data: {
          status: 'failed',
          error: error.message,
        },
      });
    };
  }

  private getRecord(payload: Upload): RmqRecord {
    return new RmqRecordBuilder({
      link: payload.source,
    })
      .setOptions({
        timestamp: Date.now(),
      })
      .build();
  }
}
