import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaperboyService } from './paperboy.service';

@Controller('paperboy')
export class PaperboyController {
  constructor(private readonly paperboyService: PaperboyService) {}

  @Cron('0 30 09 * * *')
  // @Cron('* * * * * *')
  async paperboyScheduleAtMorning() {
    await this.paperboyService.deliveryAllSubscribes();
  }
}
