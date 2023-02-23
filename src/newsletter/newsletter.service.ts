import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { NewsLetter } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import GetNewsLetterDto from './dto/get-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsLetter)
    private readonly newsLetterRepository: Repository<NewsLetter>,
  ) {}

  async createNewsLetter(dto: CreateNewsletterDto): Promise<NewsLetter> {
    return this.newsLetterRepository.save(dto);
  }

  async getNewsLetterByIDs(IDs: number[]): Promise<NewsLetter[]> {
    return this.newsLetterRepository.find({
      where: {
        _id: In(IDs),
      },
    });
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

  async getNewsLetterByFilter(dto: GetNewsLetterDto) {
    return this.newsLetterRepository
      .createQueryBuilder()
      .where({
        ...(dto.filterBy.denyIDs && {
          _id: Not(In(dto.filterBy.denyIDs)),
        }),
        category: dto.filterBy.category,
        ...(dto.filterBy.isDenyExpiredNews && {
          deliveryExpiredAt: MoreThan(new Date()),
        }),
      })
      .orderBy('RAND()')
      .getMany();
  }
}
