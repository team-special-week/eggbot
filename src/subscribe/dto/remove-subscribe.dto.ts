import { IsString } from 'class-validator';

export class RemoveSubscribeDto {
  @IsString()
  channelId: string;
}
