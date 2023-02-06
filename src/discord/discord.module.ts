import { Module } from '@nestjs/common';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';

@Module({
  imports: [SubscribeModule],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class DiscordModule {}
