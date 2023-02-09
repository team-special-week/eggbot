import { Injectable } from '@nestjs/common';
import { default as axios } from 'axios';
import cheerio from 'cheerio';
import { ENewsLetterCategory } from 'src/common/enums/newsLetterCategory';
import transformAndValidate from 'src/common/utils/transformAndValidate';
import { CreateNewsletterDto } from 'src/newsletter/dto/create-news-letter.dto';
import { NewsletterService } from 'src/newsletter/newsletter.service';

@Injectable()
export class CrawlerService {
  constructor(private readonly newsletterService: NewsletterService) {}

  async crawler(): Promise<any> {
    for (let i = 1; i <= 20; i++) {
      const TestApiCall = async () => {
        try {
          const response = await axios.get('https://news.hada.io/new');
          const $ = cheerio.load(response.data);

          const title = $('#tr' + i).text();
          const contentId = $(
            'body > main > article > div > div:nth-child(' +
              i +
              ') > div.topicdesc > a',
          ).attr('href');
          const contentUrl = 'https://news.hada.io/' + contentId;

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
              originSiteUrl: 'https://news.hada.io/new',
              contentId: contentId,
            };

            await this.newsletterService.createNewsLetter(data);
          }
        } catch (err) {
          console.log('Error >>', err);
        }
      };

      // async/await 를 활용하여 수정
    }
  }
}
