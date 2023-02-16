import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeekNewsCrawlerService } from './geeknews/geeknews-crawler.service';
import { DotNetDevCrawlerService } from './dotnetdev/dotnetdev-crawler.service';
import { SuppleCrawlerService } from './supple/supple-crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(
    private readonly geekNewsCrawlerService: GeekNewsCrawlerService,
    private readonly dotNetDevCrawlerService: DotNetDevCrawlerService,
    private readonly suppleCrawlerService: SuppleCrawlerService,
  ) {}

  @Cron('0 00 06 * * *')
  geekNewsCrawler() {
    return this.geekNewsCrawlerService.crawling();
  }

  @Cron('0 00 06 * * *')
  suppleCrawler() {
    return this.suppleCrawlerService.crawling();
  }

  @Get('/geeknews')
  testGeekNewsCrawler() {
    return this.geekNewsCrawlerService.crawling();
  }

  @Get('/supple')
  testSuppleCrawler() {
    return this.suppleCrawlerService.crawling();
  }

  @Get('/dotnetdev')
  testDotNetDevCrawler() {
    return this.dotNetDevCrawlerService.crawling();
  }
}
