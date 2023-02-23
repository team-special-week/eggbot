import { Injectable, Logger } from '@nestjs/common';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { spawn } from 'node:child_process';
import * as path from 'path';
import { DotNetDevDto } from './dto/dotnetdev.dto';
import transformAndValidate from '../../common/utils/transformAndValidate';
import DotNetDevResponseType from '../../common/types/dotnetdevResponseType';
import { CreateNewsletterDto } from '../../newsletter/dto/create-newsletter.dto';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { ENewsLetterProvider } from '../../common/enums/newsLetterProvider';
import { addDays } from 'date-fns';
import { DELIVERY_EXPIRED_DAY } from '../../config/constant';

@Injectable()
export class DotNetDevCrawlerService {
  private readonly logger = new Logger(DotNetDevCrawlerService.name);

  constructor(private readonly newsletterService: NewsletterService) {}

  async crawling() {
    const responses = await this.executeParser();

    for (const response of responses) {
      try {
        const news = await transformAndValidate(DotNetDevDto, {
          title: response.title,
          content: response.content,
          contentId: response.contentID,
          thumbnailImageUrl: response.thumbnailImageUrl,
          writerThumbnail: response.writerThumbnail,
          writerUsername: response.writerUsername,
          redirectUrl: response.redirectUrl,
          writtenAt: new Date(response.writtenAt),
        });
        const isExists =
          !!(await this.newsletterService.getNewsLetterByContentId(
            news.contentId,
          ));

        if (!isExists) {
          await this.createNewsLetter(news);
        }
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  private async createNewsLetter(dto: DotNetDevDto) {
    const createNewsLetterDto = await transformAndValidate(
      CreateNewsletterDto,
      {
        ...dto,
        deliveryExpiredAt: addDays(dto.writtenAt, DELIVERY_EXPIRED_DAY),
        category: ENewsLetterCategory.DEVELOPER,
        provider: ENewsLetterProvider.DOT_NET_DEV,
      },
    );

    return this.newsletterService.createNewsLetter(createNewsLetterDto);
  }

  private async executeParser() {
    return new Promise<DotNetDevResponseType[]>((resolve, reject) => {
      const ps = spawn(path.join(process.env.PWD, 'bin/dotnetdev/Parser'));
      let buffer = '';

      ps.stdout.on('data', (bf) => {
        buffer += bf.toString();
      });

      ps.stderr.on('data', (buffer) => {
        this.logger.error(String(buffer));
      });

      ps.stdout.on('close', (code) => {
        try {
          resolve(JSON.parse(buffer) as DotNetDevResponseType[]);
        } catch (err) {
          reject(err);
        }

        this.logger.log(`DotNetDev Parser process exited with code ${code}`);
      });
    });
  }
}
