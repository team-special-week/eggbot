import { IsEnum, IsString } from 'class-validator';
import { ENewsLetterCategory } from 'src/common/enums/newsLetterCategory';

export class CreateSubscribeDto {
  @IsString()
  channelId: string;

  @IsString()
  subscriberName: string;

  @IsEnum(ENewsLetterCategory)
  newsLetterCategory: ENewsLetterCategory;
}
