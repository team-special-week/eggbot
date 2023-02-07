import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLog } from './entities/delivery-log.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PaperboyService {
  constructor(
    @InjectRepository(DeliveryLog)
    private readonly deliveryLogRepository: Repository<DeliveryLog>,
  ) {}

  // @Cron('0 30 09 * * *')
  @Cron('30 * * * * *')
  async paperboyScheduleAtMorning() {
    console.log('paperboyScheduleAtMorning');
  }
}
