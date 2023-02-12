import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  testitNewsCrawler(): Promise<any> {
    return this.crawlerService.crawlGeekNews();
  }

  @Cron('0 00 06 * * *')
  itNewsCrawler(): Promise<any> {
    return this.crawlerService.crawlGeekNews();
  }
}
