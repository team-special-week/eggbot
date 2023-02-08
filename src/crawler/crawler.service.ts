import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { default as axios } from 'axios';
import cheerio from 'cheerio';
import { ENewsLetterCategory } from 'src/common/enums/newsLetterCategory';
import { NewsLetter } from 'src/newsletter/entities/newsletter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(NewsLetter)
    private readonly newsLetterRepository: Repository<NewsLetter>,
  ) {}
  // TODO: newsletter 모듈로 저장하기
  async crawler(): Promise<any> {
    const data = await axios
      .get('https://news.hada.io/new')
      .then(async (res) => {
        const $ = cheerio.load(res.data);

        const result = [];

        for (let i = 1; i <= 20; i++) {
          const obj = {
            title: $('#tr' + i).text(),
            url: $('#tr' + i).attr('href'),
            context:
              'https://news.hada.io/' +
              $(
                'body > main > article > div > div:nth-child(' +
                  i +
                  ') > div.topicdesc > a',
              ).attr('href'),
          };

          const tmp = await this.newsLetterRepository.findOne({
            where: { content: obj.context },
          });
          if (tmp) {
            continue;
          }

          result.push(obj);
          const today = new Date();

          const newsLetter = new NewsLetter();
          newsLetter.title = obj.title;
          newsLetter.content = obj.context;
          newsLetter.thumbnailImageUrl = '';
          newsLetter.redirectUrl = obj.url;
          newsLetter.writtenAt = today;
          newsLetter.deliveryExpiredAt = new Date(
            today.setDate(today.getDate() + 7),
          );
          newsLetter.category = ENewsLetterCategory.DEVELOPER;
          newsLetter.originSiteUrl = 'https://news.hada.io/new';
          await this.newsLetterRepository.save(newsLetter);
        }

        return result;
      });

    return data;
  }
}
