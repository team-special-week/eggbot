import { Module } from '@nestjs/common';
import { PaperboyService } from './paperboy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryLog } from './entities/delivery-log.entity';
import { SubscribeModule } from '../subscribe/subscribe.module';

@Module({
  providers: [PaperboyService],
  imports: [TypeOrmModule.forFeature([DeliveryLog]), SubscribeModule],
})
export class PaperboyModule {}
