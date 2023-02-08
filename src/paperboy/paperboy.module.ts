import { Module } from '@nestjs/common';
import { PaperboyService } from './paperboy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryLog } from './entities/delivery-log.entity';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { PaperboyController } from './paperboy.controller';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
  providers: [PaperboyService],
  imports: [
    TypeOrmModule.forFeature([DeliveryLog]),
    SubscribeModule,
    SubscribeModule,
    NewsletterModule,
    DiscordModule,
  ],
  controllers: [PaperboyController],
})
export class PaperboyModule {}
