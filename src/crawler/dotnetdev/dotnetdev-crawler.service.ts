import { Injectable } from '@nestjs/common';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { DotNetDevDto } from './dto/dotnetdev.dto';
import transformAndValidate from '../../common/utils/transformAndValidate';
import { CreateNewsletterDto } from '../../newsletter/dto/create-newsletter.dto';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { ENewsLetterProvider } from '../../common/enums/newsLetterProvider';

@Injectable()
export class DotNetDevCrawlerService {
  constructor(private readonly newsletterService: NewsletterService) {}

  async crawling() {
    const newsLetters = await this.callParser();

    for (const news of newsLetters) {
      const isExists = !!(await this.newsletterService.getNewsLetterByContentId(
        news.contentId,
      ));

      if (!isExists) {
        await this.createNewsLetter(news);
      }
    }
  }

  private async createNewsLetter(dto: DotNetDevDto) {
    const createNewsLetterDto = await transformAndValidate(
      CreateNewsletterDto,
      {
        ...dto,
        category: ENewsLetterCategory.DEVELOPER,
        provider: ENewsLetterProvider.DOT_NET_DEV,
      },
    );

    return this.newsletterService.createNewsLetter(createNewsLetterDto);
  }

  private async callParser(): Promise<DotNetDevDto[]> {
    // TODO
    // 닷넷으로 만들어진 파서를 호출하는 로직 추가

    const tmp = await transformAndValidate(DotNetDevDto, {
      title: '뉴스 제목 (파싱 잘 되었고, 필드명만 변경)',
      content: '기사 내용',
      contentId: '그 기사의 고유 ID (닷넷데브에서 구분 가능한 값으로)',
      thumbnailImageUrl: '대표 사진 1장 (없으면 null로)',
      redirectUrl: '누르면 넘어갈 URL (파싱 잘 되었고, 필드명만 변경)',
      writerThumbnail: '작성자 프로필 사진 (없으면 null로)',
      writerUsername: '작성자 유저명 (없으면 null로)',
      writtenAt: '작성일 (UploadTime 으로 되어있는데 필드명만 변경)',
    });

    return [tmp];
  }
}
