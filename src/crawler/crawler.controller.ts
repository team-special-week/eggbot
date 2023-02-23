import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeekNewsCrawlerService } from './geeknews/geeknews-crawler.service';
import { SuppleCrawlerService } from './supple/supple-crawler.service';
import ESuppleTagName from '../common/enums/suppleTagName';
import { DotNetDevCrawlerService } from './dotnetdev/dotnetdev-crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(
    private readonly geekNewsCrawlerService: GeekNewsCrawlerService,
    private readonly suppleCrawlerService: SuppleCrawlerService,
    private readonly dotnetdevCrawlerService: DotNetDevCrawlerService,
  ) {}

  @Cron('0 00 06 * * *')
  geekNewsCrawler() {
    return this.geekNewsCrawlerService.crawling();
  }

  @Cron('0 20 06 * * *')
  suppleCrawler() {
    return this.suppleCrawlerService.crawling(ESuppleTagName.IT_STORY);
  }

  @Cron('0 40 06 * * *')
  dotnetdevCrawler() {
    return this.dotnetdevCrawlerService.crawling();
  }

  @Get('/geeknews')
  geekNewsCrawlerTest() {
    return this.geekNewsCrawlerService.crawling();
  }

  @Get('/supple')
  suppleCrawlerTest() {
    return this.suppleCrawlerService.crawling(ESuppleTagName.IT_STORY);
  }

  @Get('/dotnetdev')
  dotnetdevCrawlerTest() {
    return this.dotnetdevCrawlerService.crawling();
  }
}
