import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { NewsLetter } from './entities/newsletter.entity';
import { GetNewsletterToDeliveryDto } from './dto/get-newsletter-to-delivery.dto';
import { CreateNewsletterDto } from './dto/create-news-letter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsLetter)
    private readonly newsLetterRepository: Repository<NewsLetter>,
  ) {}

  async getNewsLetterToDelivery(
    dto: GetNewsletterToDeliveryDto,
  ): Promise<NewsLetter[]> {
    return this.newsLetterRepository
      .createQueryBuilder()
      .where({
        ...(dto.ignoreIDs && {
          _id: Not(In(dto.ignoreIDs)),
        }),
        category: dto.newsLetterCategory,
        deliveryExpiredAt: MoreThan(new Date()),
      })
      .orderBy('RAND()')
      .take(dto.size)
      .getMany();
  }

  async createNewsLetter(dto: CreateNewsletterDto): Promise<NewsLetter> {
    const newsLetter = new NewsLetter();
    const now = new Date();
    newsLetter.title = dto.title;
    newsLetter.content = dto.content;
    newsLetter.thumbnailImageUrl = dto.thumbnailImageUrl;
    newsLetter.redirectUrl = dto.redirectUrl;
    newsLetter.writtenAt = now;
    newsLetter.deliveryExpiredAt = now;
    newsLetter.category = dto.category;
    newsLetter.originSiteUrl = dto.originSiteUrl;
    await this.newsLetterRepository.save(newsLetter);

    return newsLetter;
  }

  async findContentId(contentId: string): Promise<NewsLetter> {
    return this.newsLetterRepository.findOne({
      where: {contentId : contentId},
    });
  }
}
