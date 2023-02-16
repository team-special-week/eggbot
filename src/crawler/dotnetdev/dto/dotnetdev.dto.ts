import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class DotNetDevDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  contentId: string;

  @IsString()
  redirectUrl: string;

  @IsString()
  @IsOptional()
  writerThumbnail?: string;

  @IsString()
  @IsOptional()
  writerUsername?: string;

  @IsDate()
  writtenAt: Date;

  @IsDate()
  deliveryExpiredAt: Date;
}
