import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Cron('0 00 06 * * *')
  getHello(): Promise<any> {
    return this.crawlerService.crawler();
  }
}
