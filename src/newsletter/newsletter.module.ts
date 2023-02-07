import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetter } from './entities/newsletter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetter])],
})
export class NewsletterModule {}
