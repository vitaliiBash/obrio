import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@prisma/client';

import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UploadEvents } from 'src/modules/listeners/uploads/types/upload-event.enum';
import { UploadCreatedEventDto } from 'src/modules/listeners/uploads/dto/upload-events.dto';

import { GetUploadsFilters, UploadFilesDto } from './dto/uploads.dto';

@Injectable()
export class UploadsService {
  constructor(
    private readonly emitter: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFiles(user: User, params: UploadFilesDto) {
    const uploads = await Promise.all(
      params.links.map((link) => {
        return this.prisma.upload.create({
          data: {
            userId: user.id,
            source: link,
          },
        });
      }),
    );

    this.emitter.emit(
      UploadEvents.CREATED,
      new UploadCreatedEventDto({ uploads }),
    );

    return uploads;
  }

  async getUserUploads(user: User, filter: GetUploadsFilters) {
    const data = await this.prisma.upload.findMany({
      where: {
        userId: user.id,
        status: filter.status,
      },
    });

    return data;
  }
}
