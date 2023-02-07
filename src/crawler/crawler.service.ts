import { Injectable } from '@nestjs/common';
import { default as axios } from 'axios';
import cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  // TODO: newsletter 모듈로 저장하기
  async crawler(): Promise<any> {
    const data = await axios.get('https://news.hada.io/new').then((res) => {
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
        result.push(obj);
      }
      return result;
    });
    // 이미 페이지가 최신 순으로 정렬이 되어서 수집한 데이터를 확인해보면서 DB에 저장하면 될 듯
    return data;
  }
}
