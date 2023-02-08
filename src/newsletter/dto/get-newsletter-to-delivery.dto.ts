import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';

export class GetNewsletterToDeliveryDto {
  @IsEnum(ENewsLetterCategory)
  newsLetterCategory: ENewsLetterCategory;

  @IsNumber()
  size: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  ignoreIDs?: number[];
}
