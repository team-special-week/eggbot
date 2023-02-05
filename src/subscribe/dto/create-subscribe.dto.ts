import { IsString } from 'class-validator';

export class CreateSubscribeDto {
  @IsString()
  channelId: string;

  @IsString()
  subscriberName: string;
}
