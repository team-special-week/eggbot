import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { Type } from 'class-transformer';

export class GetNewsLetterFilterDto {
  @IsEnum(ENewsLetterCategory)
  category: ENewsLetterCategory;

  @IsOptional()
  @IsNumber({}, { each: true })
  denyIDs?: number[];

  @IsBoolean()
  isDenyExpiredNews: boolean;
}

export default class GetNewsLetterDto {
  @ValidateNested({ each: true })
  @Type(() => GetNewsLetterFilterDto)
  filterBy: GetNewsLetterFilterDto;
}
