import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsletterService } from '../../newsletter/newsletter.service';
import transformAndValidate from '../../common/utils/transformAndValidate';
import { addDays } from 'date-fns';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { ENewsLetterProvider } from '../../common/enums/newsLetterProvider';
import axios from 'axios';
import { SuppleDto } from './dto/supple.dto';
import { CreateNewsletterDto } from 'src/newsletter/dto/create-newsletter.dto';
import { News } from 'src/common/types/newsType';

@Injectable()
export class SuppleCrawlerService {
  private readonly SUPPLE_URL: string;
  private readonly DELIVERY_EXPIRED_DAY: number;
  private readonly NEWS_SIZE = 30;

  constructor(
    private readonly configService: ConfigService,
    private readonly newsletterService: NewsletterService,
  ) {
    this.SUPPLE_URL = this.configService.get<string>('SUPPLE_URL');
    this.DELIVERY_EXPIRED_DAY = this.configService.get<number>(
      'DELIVERY_EXPIRED_DAY',
    );
  }

  async crawling() {
    const newsDetails = await this.getSuppleAPI(
      `${this.SUPPLE_URL}=${this.NEWS_SIZE}`,
    );

    for (const index in newsDetails) {
      const news = await this.createSuppleDto(newsDetails, Number(index));
      const isExists = !!(await this.newsletterService.getNewsLetterByContentId(
        news.contentId,
      ));

      if (!isExists) {
        await this.createNewsLetter(news);
      }
    }
  }

  private async getSuppleAPI(url: string) {
    const response = await axios.get(url);
    if (response.status !== 200 || !response.data) {
      throw new Error(`${url} is not healthy.`);
    }

    const result: News = response.data.data.edges;
    return result;
  }

  private async createSuppleDto(
    newsDetails: News,
    index: number,
  ): Promise<SuppleDto> {
    const _node = newsDetails[index].node;
    if (_node === undefined || _node === null || _node === '') {
      throw new Error(`'_node' is not healthy.`);
    }
    const _id = _node.id;
    const _source = _node.source;

    const title = _node.title;
    const content = _node.desc;
    const contentId = _id;
    const thumbnailImageUrl = `https://supple-attachment.s3.ap-northeast-2.amazonaws.com/${_node.thumbnailKey}`;
    const redirectUrl = `https://supple.kr/feed/${_id}`;
    const writtenAt = new Date(_node.createdAt);
    const deliveryExpiredAt = addDays(writtenAt, this.DELIVERY_EXPIRED_DAY);
    const writerUsername = _node.author;
    const writerThumbnail = `https://supple-attachment.s3.ap-northeast-2.amazonaws.com/${_source.iconKey}`;

    return transformAndValidate(SuppleDto, {
      title: title,
      content,
      contentId,
      thumbnailImageUrl,
      redirectUrl,
      writtenAt,
      deliveryExpiredAt,
      writerThumbnail,
      writerUsername,
    });
  }

  private async createNewsLetter(dto: SuppleDto) {
    const createNewsLetterDto = await transformAndValidate(
      CreateNewsletterDto,
      {
        ...dto,
        category: ENewsLetterCategory.DEVELOPER,
        provider: ENewsLetterProvider.SUPPLE,
      },
    );

    return this.newsletterService.createNewsLetter(createNewsLetterDto);
  }
}
