import { Injectable, Logger } from '@nestjs/common';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { spawn } from 'node:child_process';
import * as path from 'path';
import { DotNetDevDto } from './dto/dotnetdev.dto';
import transformAndValidate from '../../common/utils/transformAndValidate';

@Injectable()
export class DotNetDevCrawlerService {
  private readonly logger = new Logger(DotNetDevCrawlerService.name);

  constructor(private readonly newsletterService: NewsletterService) {}

  async crawling() {
    const dotNetDevDto = await this.executeParser();
    console.log(dotNetDevDto);
  }

  private async executeParser() {
    return new Promise<DotNetDevDto[]>((resolve, reject) => {
      const ps = spawn('./' + path.join(__dirname, '../lib', 'Parser'));

      ps.stdout.on('data', (buffer) => {
        const strOfBuf = String(buffer);

        try {
          const data = JSON.parse(strOfBuf) as any[];

          Promise.all(data.map((d) => transformAndValidate(DotNetDevDto, d)))
            .then((dtos) => {
              resolve(dtos);
            })
            .catch((err) => reject(err));
        } catch (err) {
          reject(err);
        }
      });

      ps.stdout.on('close', (code) => {
        this.logger.log(`DotNetDev Parser process exited with code ${code}`);
      });
    });
  }
}
