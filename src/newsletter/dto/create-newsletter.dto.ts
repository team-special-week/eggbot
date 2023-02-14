import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ENewsLetterCategory } from 'src/common/enums/newsLetterCategory';
import { ENewsLetterProvider } from '../../common/enums/newsLetterProvider';

export class CreateNewsletterDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  contentId: string;

  @IsString()
  @IsOptional()
  thumbnailImageUrl?: string;

  @IsString()
  redirectUrl: string;

  @IsDate()
  writtenAt: Date;

  @IsDate()
  deliveryExpiredAt: Date;

  @IsEnum(ENewsLetterCategory)
  category: ENewsLetterCategory;

  @IsEnum(ENewsLetterProvider)
  provider: ENewsLetterProvider;
}
