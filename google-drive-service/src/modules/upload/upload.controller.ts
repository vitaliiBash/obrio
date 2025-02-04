import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Serialize } from 'src/common/interceptors/serialize.interceptor';

import { UploadService } from './upload.service';
import { UploadFilesDto, UploadResultDto } from './dto/upload.dto';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @MessagePattern('upload-file')
  @Serialize(UploadResultDto)
  async uploadFiles(@Payload() data: UploadFilesDto) {
    const url = await this.uploadService.upload(data.link);

    return { data: { url } };
  }
}
