import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetter } from 'src/newsletter/entities/newsletter.entity';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetter])],
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
