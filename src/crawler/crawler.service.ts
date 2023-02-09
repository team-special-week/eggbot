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
      const [title, contentUrl, contentId] = await axios
        .get('https://news.hada.io/new')
        .then((res) => {
          const $ = cheerio.load(res.data);
          const title = $('#tr' + i).text();
          const contentId = $(
            'body > main > article > div > div:nth-child(' +
              i +
              ') > div.topicdesc > a',
          ).attr('href');
          const contentUrl = 'https://news.hada.io/' + contentId;

          return [title, contentUrl, contentId.split('=')[1]];
        });

      const news = await this.newsletterService.findContentId(contentId);

      if (!news) {
        const [content] = await axios.get(contentUrl).then((res) => {
          const $ = cheerio.load(res.data);
          const content = $('#topic_contents').text();

          return [content];
        });

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
    }
  }
}
