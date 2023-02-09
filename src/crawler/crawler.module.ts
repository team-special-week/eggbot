import { Module } from '@nestjs/common';
import { NewsletterModule } from 'src/newsletter/newsletter.module';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [NewsletterModule],
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
