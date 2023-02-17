import { Injectable } from '@nestjs/common';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { GeekNewsDto } from './dto/geeknews.dto';
import transformAndValidate from '../../common/utils/transformAndValidate';
import { addDays, subDays, subHours, subMinutes, subMonths } from 'date-fns';
import loadPage from '../../common/utils/loadPage';
import { CreateNewsletterDto } from '../../newsletter/dto/create-newsletter.dto';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { ENewsLetterProvider } from '../../common/enums/newsLetterProvider';
import { GEEKNEWS_URL, DELIVERY_EXPIRED_DAY } from 'src/config/constant';

@Injectable()
export class GeekNewsCrawlerService {
  private readonly NEWS_SIZE = 15;

  constructor(private readonly newsletterService: NewsletterService) {}

  async crawling() {
    const $ = await loadPage(`${GEEKNEWS_URL}/new`);

    for (let i = 1; i < this.NEWS_SIZE + 1; ++i) {
      const news = await this.parseGeekNews($, i);
      const isExists = !!(await this.newsletterService.getNewsLetterByContentId(
        news.contentId,
      ));

      if (!isExists) {
        news.content = this.parseGeekNewsContent(
          await loadPage(news.redirectUrl),
        );
        await this.createNewsLetter(news);
      }
    }
  }

  private async createNewsLetter(dto: GeekNewsDto) {
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

  private async parseGeekNews(
    $: cheerio.Root,
    newsIdx: number,
  ): Promise<GeekNewsDto> {
    const _topic = `div.topic_row:nth-child(${newsIdx})`;
    const _title = `${_topic} > div.topictitle > a`;
    const _contentUrl = `${_topic} > div.topicdesc > a`;

    const redirectUrl = new URL(
      `${GEEKNEWS_URL}/${$(_topic + _contentUrl).attr('href')}`,
    );
    const contentId = redirectUrl.searchParams.get('id');
    const writtenAt = this.parseWrittenAt($, _topic);
    const deliveryExpiredAt = addDays(writtenAt, DELIVERY_EXPIRED_DAY);

    return transformAndValidate(GeekNewsDto, {
      title: $(_topic + _title).text(),
      redirectUrl: redirectUrl.href,
      writtenAt,
      deliveryExpiredAt,
      contentId,
    });
  }

  private parseGeekNewsContent($: cheerio.Root): string | null {
    const content = $('#topic_contents').text();

    if (!content) {
      return null;
    }

    return content;
  }

  private parseWrittenAt($: cheerio.Root, _topic: string) {
    const _topicInfo = `${_topic} > div.topicinfo`;
    const raw = $(_topicInfo).text()?.split(' ')[4];

    if (raw.indexOf('분') > -1) {
      return subMinutes(new Date(), parseInt(raw, 10));
    }

    if (raw.indexOf('시간') > -1) {
      return subHours(new Date(), parseInt(raw, 10));
    }

    if (raw.indexOf('일') > -1) {
      return subDays(new Date(), parseInt(raw, 10));
    }

    if (raw.indexOf('달') > -1) {
      return subMonths(new Date(), parseInt(raw, 10));
    }

    return new Date();
  }
}
