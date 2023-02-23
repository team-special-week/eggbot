import { IsNumber, IsString } from 'class-validator';

export default class CreateDeliveryLogDto {
  @IsString()
  channelId: string;

  @IsNumber({}, { each: true })
  newsLetterIds: number[];
}
