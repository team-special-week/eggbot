import { Module } from '@nestjs/common';
import { NewsletterModule } from 'src/newsletter/newsletter.module';
import { CrawlerController } from './crawler.controller';
import { GeekNewsCrawlerService } from './geeknews/geeknews-crawler.service';
import { DotNetDevCrawlerService } from './dotnetdev/dotnetdev-crawler.service';
import { SuppleCrawlerService } from './supple/supple-crawler.service';

@Module({
  imports: [NewsletterModule],
  controllers: [CrawlerController],
  providers: [
    GeekNewsCrawlerService,
    DotNetDevCrawlerService,
    SuppleCrawlerService,
  ],
})
export class CrawlerModule {}
