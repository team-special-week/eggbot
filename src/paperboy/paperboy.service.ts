import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLog } from './entities/delivery-log.entity';
import { SubscribeService } from '../subscribe/subscribe.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import { GetNewsletterToDeliveryDto } from '../newsletter/dto/get-newsletter-to-delivery.dto';
import transformAndValidate from '../common/utils/transformAndValidate';
import randInt from '../common/utils/randInt';
import { DiscordService } from '../discord/discord.service';
import { PAPERBOY_MAX_CNT, PAPERBOY_MIN_CNT } from 'src/config/constant';
import { CreateDeliveryLogDto } from './dto/create-delivery-log.dto';

@Injectable()
export class PaperboyService {
  constructor(
    @InjectRepository(DeliveryLog)
    private readonly deliveryLogRepository: Repository<DeliveryLog>,
    private readonly subscribeService: SubscribeService,
    private readonly newsLetterService: NewsletterService,
    private readonly discordService: DiscordService,
  ) {}

  private readonly logger = new Logger(PaperboyService.name);

  async deliveryAllSubscribes() {
    const subscribes = await this.subscribeService.getAllSubscribes();

    for (const subscribe of subscribes) {
      const setting = subscribe.setting;
      const deliveryLogs = await this.getDeliveryLogsByChannelId(
        subscribe.channelId,
      );

      try {
        const getNewsletterToDeliveryDto = await transformAndValidate(
          GetNewsletterToDeliveryDto,
          {
            newsLetterCategory: setting.newLetterCategory,
            size: randInt(PAPERBOY_MIN_CNT, PAPERBOY_MAX_CNT),
            ignoreIDs: deliveryLogs.map((deliveryLog) => deliveryLog._id),
          },
        );

        const newsLetterToDelivery =
          await this.newsLetterService.getNewsLetterToDelivery(
            getNewsletterToDeliveryDto,
          );

        await this.discordService.deliveryNewsLetter(
          subscribe.channelId,
          newsLetterToDelivery,
        );

        const createDeliveryLogDto = await transformAndValidate(
          CreateDeliveryLogDto,
          {
            newsLetterId: newsLetterToDelivery.map(
              (newsLetter) => newsLetter._id,
            ),
            channelId: subscribe.channelId,
          },
        );

        await this.createDeliveryLog(createDeliveryLogDto);
      } catch (ex) {
        this.logger.error(ex);
      }
    }
  }

  async getDeliveryLogsByChannelId(channelId: string) {
    return this.deliveryLogRepository.find({
      where: {
        channelId,
      },
    });
  }

  async createDeliveryLog(dto: CreateDeliveryLogDto) {
    return Promise.all(
      dto.newsLetterId.map(async (newsLetterId) => {
        const newsLetter = await this.newsLetterService.getNewsLetterById(
          newsLetterId,
        );

        if (!newsLetter) {
          throw new Error(`${dto.newsLetterId} newsLetter is not found.`);
        }

        await this.deliveryLogRepository.save({
          newsLetter,
          channelId: dto.channelId,
        });
      }),
    );
  }
}
