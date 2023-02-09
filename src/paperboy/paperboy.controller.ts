import { Controller } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { PaperboyService } from './paperboy.service';

@Controller('paperboy')
export class PaperboyController {
  constructor(private readonly paperboyService: PaperboyService) {}

  @Cron('0 0 10,13,16,19 * * *')
  async paperboySchedule() {
    await this.paperboyService.deliveryAllSubscribes();
  }
}
