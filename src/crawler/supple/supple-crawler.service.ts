import { Injectable } from '@nestjs/common';
import { NewsletterService } from '../../newsletter/newsletter.service';
import transformAndValidate from '../../common/utils/transformAndValidate';
import { addDays } from 'date-fns';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { ENewsLetterProvider } from '../../common/enums/newsLetterProvider';
import axios from 'axios';
import { SuppleDto } from './dto/supple.dto';
import { CreateNewsletterDto } from 'src/newsletter/dto/create-newsletter.dto';
import ESuppleTagName from '../../common/enums/suppleTagName';
import SuppleNodeType from '../../common/types/suppleResponseType';
import { SUPPLE_URL, DELIVERY_EXPIRED_DAY } from 'src/config/constant';

@Injectable()
export class SuppleCrawlerService {
  private readonly NEWS_SIZE = 30;

  constructor(private readonly newsletterService: NewsletterService) {}

  async crawling(tag: ESuppleTagName) {
    const suppleNodes = await this.requestSuppleAPI(tag);

    for (const node of suppleNodes) {
      const suppleDto = await this.parsingSuppleResponse(node);
      const isExists = !!(await this.newsletterService.getNewsLetterByContentId(
        suppleDto.contentId,
      ));

      if (!isExists) {
        await this.createNewsLetter(suppleDto);
      }
    }
  }

  private async requestSuppleAPI(
    tag: ESuppleTagName,
  ): Promise<SuppleNodeType[]> {
    const response = await axios.get(SUPPLE_URL, {
      params: {
        tagName: tag,
        first: this.NEWS_SIZE,
      },
    });

    if (response.status !== 200 || !response.data) {
      throw new Error(`${SUPPLE_URL} is not healthy.`);
    }

    const data: any[] = response.data?.data?.edges;
    if (!data) {
      throw new Error('supple data is empty.');
    }

    return data.map((d) => d.node as SuppleNodeType);
  }

  private parsingSuppleResponse(_node: SuppleNodeType): Promise<SuppleDto> {
    return transformAndValidate(SuppleDto, {
      title: _node.title,
      content: _node.desc,
      contentId: _node.id,
      thumbnailImageUrl: `https://supple-attachment.s3.ap-northeast-2.amazonaws.com/${_node.thumbnailKey}`,
      redirectUrl: `https://supple.kr/feed/${_node.id}`,
      writtenAt: new Date(_node.releasedAt),
      deliveryExpiredAt: addDays(
        new Date(_node.releasedAt),
        DELIVERY_EXPIRED_DAY,
      ),
      writerUsername: _node.author,
      writerThumbnail: `https://supple-attachment.s3.ap-northeast-2.amazonaws.com/${_node.source.iconKey}`,
    });
  }

  private async createNewsLetter(dto: SuppleDto) {
    const createNewsLetterDto = await transformAndValidate(
      CreateNewsletterDto,
      {
        ...dto,
        category: ENewsLetterCategory.DEVELOPER,
        provider: ENewsLetterProvider.SUPPLE,
      },
    );

    return this.newsletterService.createNewsLetter(createNewsLetterDto);
  }
}
