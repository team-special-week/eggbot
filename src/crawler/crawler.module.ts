import { Module } from '@nestjs/common';
import { NewsletterModule } from 'src/newsletter/newsletter.module';
import { CrawlerController } from './crawler.controller';
import { GeekNewsCrawlerService } from './geeknews/geeknews-crawler.service';
import { DotNetDevCrawlerService } from './dotnetdev/dotnetdev-crawler.service';

@Module({
  imports: [NewsletterModule],
  controllers: [CrawlerController],
  providers: [GeekNewsCrawlerService, DotNetDevCrawlerService],
})
export class CrawlerModule {}
