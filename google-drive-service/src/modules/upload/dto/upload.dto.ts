import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class UploadFilesDto {
  @IsDefined()
  @IsString()
  link: string;
}

export class UploadResultDto {
  @Expose()
  url: string;
}
