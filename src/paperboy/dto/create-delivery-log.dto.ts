import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateDeliveryLogDto {
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  newsLetterId: number[];

  @IsString()
  channelId: string;
}
