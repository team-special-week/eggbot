import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetter } from './entities/newsletter.entity';
import { NewsletterService } from './newsletter.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetter])],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
