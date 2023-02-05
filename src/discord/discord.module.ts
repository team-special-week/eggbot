import { Module } from '@nestjs/common';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { DiscordController } from './discord.controller';

@Module({
  imports: [SubscribeModule],
  controllers: [DiscordController],
})
export class DiscordModule {}
