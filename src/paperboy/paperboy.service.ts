import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLog } from './entities/delivery-log.entity';
import { SubscribeService } from '../subscribe/subscribe.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import transformAndValidate from '../common/utils/transformAndValidate';
import { DiscordService } from '../discord/discord.service';
import { NEWS_LETTER_COUNT } from 'src/config/constant';
import CreateDeliveryLogDto from './dto/create-delivery-log.dto';
import GetNewsLetterDto from '../newsletter/dto/get-newsletter.dto';
import SendNewsLetterDto from 'src/discord/dto/send-newsletter.dto';

@Injectable()
export class PaperboyService {
  constructor(
    @InjectRepository(DeliveryLog)
    private readonly deliveryLogRepository: Repository<DeliveryLog>,
    private readonly subscribeService: SubscribeService,
    private readonly newsLetterService: NewsletterService,
    private readonly discordService: DiscordService,
  ) {}

  async deliveryNewsLetter() {
    const subscribes = await this.subscribeService.getAllSubscribes();

    for (const subscribe of subscribes) {
      const { newsLetterCategory } = subscribe.setting;
      const { channelId } = subscribe;

      const deliveryLogs = await this.getDeliveryLogsByChannelId(channelId);

      const getNewsLetterDto = await transformAndValidate(GetNewsLetterDto, {
        filterBy: {
          category: newsLetterCategory,
          denyIDs: deliveryLogs.map((deliveryLog) => deliveryLog._id),
          isDenyExpiredNews: true,
        },
      });
      const newsLettersToSend = (
        await this.newsLetterService.getNewsLetterByFilter(getNewsLetterDto)
      ).slice(0, NEWS_LETTER_COUNT);

      if (newsLettersToSend.length > 0) {
        const createDeliveryLogDto = await transformAndValidate(
          CreateDeliveryLogDto,
          {
            channelId,
            newsLetterIds: newsLettersToSend.map(
              (newsLetter) => newsLetter._id,
            ),
          },
        );
        await this.createDeliveryLog(createDeliveryLogDto);

        const sendNewsLetterDto = await transformAndValidate(
          SendNewsLetterDto,
          {
            channelId,
            newsLetters: newsLettersToSend,
          },
        );
        await this.discordService.sendNewsLetter(sendNewsLetterDto);
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
    const newsLetters = await this.newsLetterService.getNewsLetterByIDs(
      dto.newsLetterIds,
    );

    return this.deliveryLogRepository
      .createQueryBuilder()
      .insert()
      .into(DeliveryLog)
      .values(
        newsLetters.map((newsLetter) => ({
          channelId: dto.channelId,
          newsLetter,
        })),
      )
      .execute();
  }
}
