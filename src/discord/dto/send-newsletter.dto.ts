import { IsArray, IsString } from 'class-validator';
import { NewsLetter } from '../../newsletter/entities/newsletter.entity';

export default class SendNewsLetterDto {
  @IsString()
  channelId: string;

  @IsArray()
  newsLetters: NewsLetter[];
}
