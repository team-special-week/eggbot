import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NewsletterService } from '../../newsletter/newsletter.service';

@Injectable()
export class DotNetDevCrawlerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly newsletterService: NewsletterService,
  ) {}
}
