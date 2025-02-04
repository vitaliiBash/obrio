import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { User } from '@prisma/client';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ReqUser } from 'src/common/decorators/user.decorator';

import { UploadsService } from './uploads.service';
import { GetUploadsFilters, Upload, UploadFilesDto } from './dto/uploads.dto';

@Controller({
  version: '1',
  path: 'uploads',
})
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post()
  @Serialize(Upload)
  async uploadFiles(@ReqUser() user: User, @Body() body: UploadFilesDto) {
    const data = await this.service.uploadFiles(user, body);

    return { data };
  }

  @Get()
  @Serialize(Upload)
  async getUploads(@ReqUser() user: User, @Query() filters: GetUploadsFilters) {
    const data = await this.service.getUserUploads(user, filters);

    return { data };
  }
}
