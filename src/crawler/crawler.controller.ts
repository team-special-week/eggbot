import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeekNewsCrawlerService } from './geeknews/geeknews-crawler.service';
import { SuppleCrawlerService } from './supple/supple-crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(
    private readonly geekNewsCrawlerService: GeekNewsCrawlerService,
    private readonly suppleCrawlerService: SuppleCrawlerService,
  ) {}

  @Cron('0 00 06 * * *')
  geekNewsCrawler() {
    return this.geekNewsCrawlerService.crawling();
  }

  @Get('/geeknews')
  testGeekNewsCrawler() {
    return this.geekNewsCrawlerService.crawling();
  }

  @Get('/supple')
  testSuppleCrawler() {
    return this.suppleCrawlerService.crawling();
  }
}
