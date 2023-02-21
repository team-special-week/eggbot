import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaperboyService } from './paperboy.service';

@Controller('paperboy')
export class PaperboyController {
  constructor(private readonly paperboyService: PaperboyService) {}

  @Cron('0 0 1,4,7,8 * * *')
  async paperboySchedule() {
    await this.paperboyService.deliveryNewsLetter();
  }

  @Get('/test')
  async paperboyScheduleTest() {
    await this.paperboyService.deliveryNewsLetter();
  }
}
