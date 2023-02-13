import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class GeekNewsDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  redirectUrl: string;

  @IsDate()
  writtenAt: Date;

  @IsDate()
  deliveryExpiredAt: Date;

  @IsString()
  contentId: string;
}
