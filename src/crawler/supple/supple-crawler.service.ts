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

@Injectable()
export class SuppleCrawlerService {
  private readonly SUPPLE_URL: string;
  private readonly DELIVERY_EXPIRED_DAY: number;
  private readonly NEWS_SIZE = 10;

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
    const $ = await this.getJson(`${this.SUPPLE_URL}=${this.NEWS_SIZE}`); // 추상화 필요
    for (const index in $) {
      const news = await this.parseSupple($, index);
      // 이미지를 어떻게 하면 잘 불러올지 생각을 해야할 것 같습니다.
      const isExists = !!(await this.newsletterService.getNewsLetterByContentId(
        news.contentId,
      ));

      if (!isExists) {
        await this.createNewsLetter(news);
      }
    }
  }

  private async getJson(url: string) {
    const datas = await axios.get(url);
    const result = datas.data.data.edges;
    return result;
  }

  private async parseSupple($, index: string): Promise<SuppleDto> {
    const _node = $[index].node;

    const title = _node.title;
    const content = _node.desc;
    const contentId = _node.id;
    const _thumbnailImageUrl = _node.thumbnail;
    const _redirectUrl = _node.url;
    const writtenAt = new Date(_node.createdAt);
    const deliveryExpiredAt = addDays(writtenAt, this.DELIVERY_EXPIRED_DAY);
    const writerUsername = _node.author;
    const writerThumbnail = _node.source.iconKey;

    // 변수 명에 _의 의미는 뭔가요?

    return transformAndValidate(SuppleDto, {
      title: title,
      content,
      contentId,
      thumbnailImageUrl: _thumbnailImageUrl,
      redirectUrl: _redirectUrl,
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
        provider: ENewsLetterProvider.GEEK_NEWS,
      },
    );

    return this.newsletterService.createNewsLetter(createNewsLetterDto);
  }
}
