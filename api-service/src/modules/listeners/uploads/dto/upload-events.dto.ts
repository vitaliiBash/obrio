import { Upload } from '@prisma/client';

export class UploadCreatedEventDto {
  public readonly uploads: Upload[];

  constructor(params: { uploads: Upload[] }) {
    this.uploads = params.uploads;
  }
}
