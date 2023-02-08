import { Controller, Get } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('/crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('/get')
  getHello(): Promise<any> {
    return this.crawlerService.crawler();
  }
}
