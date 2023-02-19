import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { NewsLetter } from './entities/newsletter.entity';
import { GetNewsletterToDeliveryDto } from './dto/get-newsletter-to-delivery.dto';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

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
    return this.newsLetterRepository.save(dto);
  }

  async getNewsLetterByContentId(
    contentId: string,
  ): Promise<NewsLetter | null> {
    return this.newsLetterRepository.findOne({
      where: {
        contentId,
      },
    });
  }

  async getNewsLetterById(id: number) {
    return this.newsLetterRepository.findOne({
      where: {
        _id: id,
      },
    });
  }
}
