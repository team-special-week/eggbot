import { IsDate, IsEnum, IsString, Length, ValidateIf } from 'class-validator';
import { ENewsLetterCategory } from 'src/common/enums/newsLetterCategory';

export class CreateNewsletterDto {
  @IsString()
  @Length(255)
  title: string;

  @IsString()
  content: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  thumbnailImageUrl: string;

  @IsString()
  redirectUrl: string;

  @IsString()
  writtenAt: string;

  @IsString()
  deliveryExpiredAt: string;

  @IsEnum(ENewsLetterCategory)
  category: ENewsLetterCategory;

  @IsString()
  @Length(255)
  contentId: string;
}
