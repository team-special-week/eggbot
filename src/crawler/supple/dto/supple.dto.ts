import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class SuppleDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  contentId: string;

  @IsString()
  thumbnailImageUrl: string;

  @IsString()
  redirectUrl: string;

  @IsDate()
  writtenAt: Date;

  @IsDate()
  deliveryExpiredAt: Date;

  @IsString()
  @IsOptional()
  writerThumbnail?: string;

  @IsString()
  @IsOptional()
  writerUsername?: string;
}
