import { Injectable } from '@nestjs/common';
import { default as axios } from 'axios';
import cheerio from 'cheerio';
import { ENewsLetterCategory } from 'src/common/enums/newsLetterCategory';
import { CreateNewsletterDto } from 'src/newsletter/dto/create-news-letter.dto';
import { ConfigService } from '@nestjs/config';
import { NewsletterService } from 'src/newsletter/newsletter.service';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly newsletterService: NewsletterService,
  ) {
    this.GEEKNEWS_URL = this.configService.get<string>('GEEKNEWS_URL');
  }

  private readonly GEEKNEWS_URL: string; // env에 가져올 주소 추가했습니다.

  async crawlGeekNews(): Promise<any> {
    const apiCall = async () => {
      try {
        const response = await axios.get(this.GEEKNEWS_URL + '/new');
        const $ = cheerio.load(response.data);

        for (let number = 1; number < 21; number++) {
          const topicSelecter = `div.topic_row:nth-child(${number})`;
          const titleSelecter = topicSelecter + ' > div.topictitle > a';
          const contentUrlSelecter = topicSelecter + ' > div.topicdesc > a';

          const title = $(topicSelecter + titleSelecter).text();
          const contentId = $(topicSelecter + contentUrlSelecter).attr('href');
          const contentUrl = this.GEEKNEWS_URL + contentId;

          const news = await this.newsletterService.findContentId(contentId);

          if (!news) {
            const response2 = await axios.get(contentUrl);
            const $2 = cheerio.load(response2.data);
            const content = $2('#topic_contents').text();

            const data: CreateNewsletterDto = {
              title: title,
              content: content,
              thumbnailImageUrl: null,
              redirectUrl: contentUrl,
              writtenAt: Date.now().toString(),
              deliveryExpiredAt: Date.now().toString(),
              category: ENewsLetterCategory.DEVELOPER,
              contentId: contentId,
            };

            await this.newsletterService.createNewsLetter(data);
          }
        }
      } catch (err) {
        console.log('Error >>', err);
      }
    };

    apiCall();
  }

  // TODO : 닷넷데브 사이트 크롤링 서비스 추가

  // TODO : 서플 사이트 크롤링 서비스 추가

  // TODO : 여러 사이트 크롤링 서비스 추가 후 공통되는 코드가 있으면 private 함수로 만들어보기
}
