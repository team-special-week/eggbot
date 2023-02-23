import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class DotNetDevDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  content: string;

  @IsString()
  contentId: string;

  @IsOptional()
  @IsString()
  thumbnailImageUrl?: string;

  @IsString()
  @IsOptional()
  writerThumbnail?: string;

  @IsString()
  writerUsername: string;

  @IsString()
  redirectUrl: string;

  @IsDate()
  writtenAt: Date;
}
