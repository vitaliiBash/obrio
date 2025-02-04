import { Injectable } from '@nestjs/common';

import axios from 'axios';
import * as path from 'path';

import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class UploadService {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  async upload(link) {
    const name = path.basename(link);

    const { data } = await axios({
      method: 'GET',
      url: link,
      responseType: 'stream',
    });

    const url = await this.googleDriveService.upload(name, data);

    return url;
  }
}
