import { Expose } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { UploadStatus } from '@prisma/client';

export class GetUploadsFilters {
  @IsOptional()
  @IsEnum(UploadStatus)
  status?: UploadStatus;
}

export class UploadFilesDto {
  @IsDefined()
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  links: string[];
}

export class Upload {
  @Expose()
  id: number;

  @Expose()
  status: UploadStatus;

  @Expose()
  userId: number;

  @Expose()
  source: string;

  @Expose()
  link?: string;
}
